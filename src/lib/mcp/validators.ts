import { z } from "zod";
import type {
  ArgumentItem,
  EnvVariable,
  McpServerDefinition,
  ValidationIssue,
  ValidationResult,
} from "@/types/mcp";
import {
  argsArrayToList,
  createEmptyServer,
  createId,
  envRecordToList,
} from "@/lib/mcp/types";
import { scanWorkspaceSecrets } from "@/lib/mcp/secretScanner";

const envRecordSchema = z.record(z.string(), z.string());

const stdioServerSchema = z
  .object({
    command: z.string().min(1, "STDIO servers require a non-empty command"),
    args: z.array(z.string()).optional(),
    env: envRecordSchema.optional(),
    url: z.string().optional(),
    headers: envRecordSchema.optional(),
  })
  .passthrough();

const sseServerSchema = z
  .object({
    url: z.string().url("SSE servers require a valid URL"),
    headers: envRecordSchema.optional(),
    env: envRecordSchema.optional(),
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
  })
  .passthrough();

const serverSchema = z.union([stdioServerSchema, sseServerSchema]);

const mcpConfigSchema = z.object({
  mcpServers: z.record(z.string(), serverSchema),
});

const zedConfigSchema = z.object({
  context_servers: z.record(z.string(), serverSchema),
});

function issue(
  severity: ValidationIssue["severity"],
  message: string,
  extras: Partial<ValidationIssue> = {},
): ValidationIssue {
  return {
    id: createId("issue"),
    severity,
    message,
    ...extras,
  };
}

function findLineForPath(json: string, pathHint: string): number | undefined {
  if (!json || !pathHint) return undefined;
  const needle = pathHint.split(".").pop();
  if (!needle) return undefined;
  const lines = json.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes(`"${needle}"`)) {
      return i + 1;
    }
  }
  return undefined;
}

export function parseJsonSafely(input: string): {
  ok: true;
  data: unknown;
} | {
  ok: false;
  error: string;
  line?: number;
} {
  try {
    return { ok: true, data: JSON.parse(input) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    const match = /position\s+(\d+)/i.exec(message);
    let line: number | undefined;
    if (match) {
      const position = Number(match[1]);
      line = input.slice(0, position).split("\n").length;
    }
    return { ok: false, error: `❌ Invalid JSON: ${message}`, line };
  }
}

export function validateServerDefinition(
  server: McpServerDefinition,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const name = server.name.trim();

  if (!name) {
    issues.push(
      issue("error", "❌ Server name is required", {
        path: "name",
        serverName: server.name,
      }),
    );
  } else if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name)) {
    issues.push(
      issue(
        "error",
        `❌ Server "${name}" has an invalid name (use letters, numbers, ., _, -)`,
        { path: "name", serverName: name },
      ),
    );
  }

  if (server.transport === "stdio") {
    if (!server.command.trim()) {
      issues.push(
        issue("error", `❌ Server "${name || "(unnamed)"}" is missing a command`, {
          path: "command",
          serverName: name || undefined,
        }),
      );
    }
  } else {
    const url = server.url.trim();
    if (!url) {
      issues.push(
        issue("error", `❌ Server "${name || "(unnamed)"}" is missing a URL`, {
          path: "url",
          serverName: name || undefined,
        }),
      );
    } else {
      try {
        void new URL(url);
      } catch {
        issues.push(
          issue("error", `❌ Server "${name || "(unnamed)"}" has an invalid URL`, {
            path: "url",
            serverName: name || undefined,
          }),
        );
      }
    }
  }

  for (const env of server.env) {
    if (env.value && !env.key.trim()) {
      issues.push(
        issue(
          "error",
          `❌ Server "${name || "(unnamed)"}" has an environment value without a key`,
          { path: "env", serverName: name || undefined },
        ),
      );
    }
  }

  return issues;
}

export function validateWorkspace(
  servers: McpServerDefinition[],
  generatedJson = "",
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (servers.length === 0) {
    issues.push(
      issue("info", "Add a preset or create a custom server to get started"),
    );
  }

  const names = new Map<string, number>();
  for (const server of servers) {
    const key = server.name.trim().toLowerCase();
    if (!key) continue;
    names.set(key, (names.get(key) ?? 0) + 1);
  }

  for (const [name, count] of names.entries()) {
    if (count > 1) {
      issues.push(
        issue("error", `❌ Duplicate server name "${name}"`, {
          path: "name",
          serverName: name,
        }),
      );
    }
  }

  for (const server of servers) {
    if (!server.enabled) continue;
    issues.push(...validateServerDefinition(server));
  }

  const secrets = scanWorkspaceSecrets(servers.filter((s) => s.enabled));
  for (const secret of secrets) {
    issues.push(
      issue(
        "warning",
        `⚠️ Server "${secret.serverName}" has a potentially exposed secret (${secret.pattern})`,
        {
          path: secret.path,
          serverName: secret.serverName,
          line: findLineForPath(generatedJson, secret.key),
        },
      ),
    );
  }

  const hasErrors = issues.some((item) => item.severity === "error");
  if (!hasErrors && servers.some((s) => s.enabled)) {
    issues.unshift(
      issue("success", "✅ Valid MCP configuration"),
    );
  } else if (hasErrors) {
    // leave errors as-is
  }

  return {
    valid: !hasErrors,
    issues,
  };
}

export function validateImportedJson(input: string): {
  result: ValidationResult;
  servers: McpServerDefinition[];
} {
  const parsed = parseJsonSafely(input);
  if (!parsed.ok) {
    return {
      result: {
        valid: false,
        issues: [
          issue("error", parsed.error, { line: parsed.line }),
        ],
      },
      servers: [],
    };
  }

  const data = parsed.data;
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return {
      result: {
        valid: false,
        issues: [issue("error", "❌ Root value must be a JSON object")],
      },
      servers: [],
    };
  }

  const record = data as Record<string, unknown>;
  let serversRaw: unknown;

  if ("mcpServers" in record) {
    const check = mcpConfigSchema.safeParse(record);
    if (!check.success) {
      return {
        result: {
          valid: false,
          issues: check.error.issues.map((err) =>
            issue(
              "error",
              `❌ ${err.path.join(".") || "config"}: ${err.message}`,
              { path: err.path.join(".") },
            ),
          ),
        },
        servers: [],
      };
    }
    serversRaw = check.data.mcpServers;
  } else if ("context_servers" in record) {
    const check = zedConfigSchema.safeParse(record);
    if (!check.success) {
      return {
        result: {
          valid: false,
          issues: check.error.issues.map((err) =>
            issue(
              "error",
              `❌ ${err.path.join(".") || "config"}: ${err.message}`,
              { path: err.path.join(".") },
            ),
          ),
        },
        servers: [],
      };
    }
    serversRaw = check.data.context_servers;
  } else {
    return {
      result: {
        valid: false,
        issues: [
          issue(
            "error",
            "❌ Missing `mcpServers` (or Zed `context_servers`) object",
          ),
        ],
      },
      servers: [],
    };
  }

  const servers: McpServerDefinition[] = Object.entries(
    serversRaw as Record<string, Record<string, unknown>>,
  ).map(([name, config]) => importedServerToDefinition(name, config));

  const workspace = validateWorkspace(servers, input);
  return { result: workspace, servers };
}

function importedServerToDefinition(
  name: string,
  config: Record<string, unknown>,
): McpServerDefinition {
  const hasUrl = typeof config.url === "string" && config.url.length > 0;
  const env =
    typeof config.env === "object" && config.env !== null
      ? envRecordToList(config.env as Record<string, string>)
      : [];
  const headers =
    typeof config.headers === "object" && config.headers !== null
      ? envRecordToList(config.headers as Record<string, string>)
      : [];
  const args = Array.isArray(config.args)
    ? argsArrayToList(config.args.map(String))
    : [];

  const command =
    typeof config.command === "string" ? config.command : hasUrl ? "" : "npx";

  let commandRunner: McpServerDefinition["commandRunner"] = "custom";
  if (["npx", "node", "python", "docker", "uvx"].includes(command)) {
    commandRunner = command as McpServerDefinition["commandRunner"];
  }

  return createEmptyServer({
    name,
    enabled: true,
    transport: hasUrl ? "sse" : "stdio",
    command,
    commandRunner,
    args,
    env,
    headers,
    url: hasUrl ? String(config.url) : "",
  });
}

export function addArgument(
  args: ArgumentItem[],
  value = "",
): ArgumentItem[] {
  return [...args, { id: createId("arg"), value }];
}

export function removeArgument(
  args: ArgumentItem[],
  id: string,
): ArgumentItem[] {
  return args.filter((item) => item.id !== id);
}

export function updateArgument(
  args: ArgumentItem[],
  id: string,
  value: string,
): ArgumentItem[] {
  return args.map((item) => (item.id === id ? { ...item, value } : item));
}

export function addEnvVariable(
  env: EnvVariable[],
  key = "",
  value = "",
): EnvVariable[] {
  return [...env, { id: createId("env"), key, value }];
}

export function removeEnvVariable(
  env: EnvVariable[],
  id: string,
): EnvVariable[] {
  return env.filter((item) => item.id !== id);
}

export function updateEnvVariable(
  env: EnvVariable[],
  id: string,
  patch: Partial<Pick<EnvVariable, "key" | "value">>,
): EnvVariable[] {
  return env.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function deleteServer(
  servers: McpServerDefinition[],
  id: string,
): McpServerDefinition[] {
  return servers.filter((server) => server.id !== id);
}

export function toggleServerEnabled(
  servers: McpServerDefinition[],
  id: string,
  enabled: boolean,
): McpServerDefinition[] {
  return servers.map((server) =>
    server.id === id ? { ...server, enabled } : server,
  );
}

export function upsertServer(
  servers: McpServerDefinition[],
  next: McpServerDefinition,
): McpServerDefinition[] {
  const index = servers.findIndex((server) => server.id === next.id);
  if (index === -1) return [...servers, next];
  const copy = [...servers];
  copy[index] = next;
  return copy;
}
