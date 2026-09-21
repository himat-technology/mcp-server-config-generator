import { describe, expect, it } from "vitest";
import {
  addArgument,
  addEnvVariable,
  argsListToArray,
  buildServersRecord,
  computeConfigStats,
  createEmptyServer,
  deleteServer,
  envListToRecord,
  generateConfig,
  generateConfigJson,
  getDownloadFilename,
  parseJsonSafely,
  presetToServer,
  removeArgument,
  removeEnvVariable,
  sanitizeWorkspace,
  scanWorkspaceSecrets,
  toggleServerEnabled,
  updateArgument,
  updateEnvVariable,
  validateImportedJson,
  validateWorkspace,
  PRESETS,
} from "@/lib/mcp";

describe("JSON parsing", () => {
  it("parses valid JSON", () => {
    const result = parseJsonSafely('{"mcpServers":{}}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ mcpServers: {} });
    }
  });

  it("handles invalid JSON gracefully", () => {
    const result = parseJsonSafely("{not-json");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Invalid JSON");
    }
  });
});

describe("MCP validation", () => {
  it("accepts a valid stdio workspace", () => {
    const server = createEmptyServer({
      name: "filesystem",
      command: "npx",
      args: [
        { id: "a1", value: "-y" },
        { id: "a2", value: "@modelcontextprotocol/server-filesystem" },
      ],
    });
    const result = validateWorkspace([server]);
    expect(result.valid).toBe(true);
    expect(result.issues.some((i) => i.severity === "success")).toBe(true);
  });

  it("flags missing mcpServers on import", () => {
    const { result } = validateImportedJson("{}");
    expect(result.valid).toBe(false);
    expect(result.issues[0]?.message).toContain("Missing `mcpServers`");
  });

  it("flags missing command for STDIO", () => {
    const server = createEmptyServer({ name: "broken", command: "" });
    const result = validateWorkspace([server]);
    expect(result.valid).toBe(false);
    expect(
      result.issues.some((i) => i.message.includes("missing a command")),
    ).toBe(true);
  });

  it("flags invalid SSE URLs", () => {
    const server = createEmptyServer({
      name: "remote",
      transport: "sse",
      url: "not-a-url",
    });
    const result = validateWorkspace([server]);
    expect(result.valid).toBe(false);
  });

  it("flags duplicate server names", () => {
    const a = createEmptyServer({ name: "dup", command: "npx" });
    const b = createEmptyServer({ name: "dup", command: "npx" });
    const result = validateWorkspace([a, b]);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes("Duplicate"))).toBe(
      true,
    );
  });

  it("validates empty configuration as non-error info", () => {
    const result = validateWorkspace([]);
    expect(result.valid).toBe(true);
    expect(result.issues.some((i) => i.severity === "info")).toBe(true);
  });
});

describe("server lifecycle", () => {
  it("creates, disables, and deletes servers", () => {
    let servers = [
      createEmptyServer({ name: "one", command: "npx" }),
      createEmptyServer({ name: "two", command: "npx" }),
    ];
    expect(servers).toHaveLength(2);

    servers = toggleServerEnabled(servers, servers[0].id, false);
    expect(servers[0].enabled).toBe(false);

    const json = generateConfig(servers, "raw") as {
      mcpServers: Record<string, unknown>;
    };
    expect(Object.keys(json.mcpServers)).toEqual(["two"]);

    servers = deleteServer(servers, servers[1].id);
    expect(servers).toHaveLength(1);
    expect(servers[0].name).toBe("one");
  });
});

describe("arguments and env vars", () => {
  it("manages arguments including empty and long unicode values", () => {
    let args = addArgument([], "-y");
    args = addArgument(args, "📦-package");
    args = updateArgument(args, args[1].id, "x".repeat(500));
    expect(argsListToArray(args)[1]).toHaveLength(500);
    args = removeArgument(args, args[0].id);
    expect(args).toHaveLength(1);
  });

  it("manages environment variables", () => {
    let env = addEnvVariable([], "FOO", "bar");
    env = updateEnvVariable(env, env[0].id, { value: "baz" });
    expect(envListToRecord(env)).toEqual({ FOO: "baz" });
    env = removeEnvVariable(env, env[0].id);
    expect(env).toHaveLength(0);
  });

  it("omits empty args and empty env keys from export", () => {
    const server = createEmptyServer({
      name: "demo",
      command: "npx",
      args: [
        { id: "1", value: "-y" },
        { id: "2", value: "" },
      ],
      env: [
        { id: "e1", key: "A", value: "1" },
        { id: "e2", key: "", value: "ignored" },
      ],
    });
    const exported = buildServersRecord([server]).demo as {
      args?: string[];
      env?: Record<string, string>;
    };
    expect(exported.args).toEqual(["-y"]);
    expect(exported.env).toEqual({ A: "1" });
  });
});

describe("presets", () => {
  it("creates unique names when preset already exists", () => {
    const first = presetToServer(PRESETS[0]);
    const second = presetToServer(PRESETS[0], [first.name]);
    expect(first.name).toBe("filesystem");
    expect(second.name).toBe("filesystem-2");
  });

  it("includes brave search placeholder env", () => {
    const brave = PRESETS.find((p) => p.id === "brave-search");
    expect(brave?.env.BRAVE_API_KEY).toBe("YOUR_BRAVE_API_KEY_HERE");
  });

  it("supports custom SSE preset", () => {
    const sse = PRESETS.find((p) => p.id === "custom-sse");
    expect(sse?.transport).toBe("sse");
    expect(sse?.url).toContain("https://");
  });
});

describe("secret detection and sanitization", () => {
  it("detects sk- style secrets", () => {
    const server = createEmptyServer({
      name: "openai",
      command: "npx",
      env: [
        {
          id: "1",
          key: "OPENAI_API_KEY",
          value: "sk-abcdefghijklmnopqrstuvwxyz",
        },
      ],
    });
    const findings = scanWorkspaceSecrets([server]);
    expect(findings.length).toBeGreaterThan(0);
  });

  it("detects github tokens and ignores placeholders", () => {
    const server = createEmptyServer({
      name: "github",
      command: "npx",
      env: [
        { id: "1", key: "TOKEN", value: "ghp_abcdefghijklmnopqrstuvwx" },
        {
          id: "2",
          key: "BRAVE_API_KEY",
          value: "YOUR_BRAVE_API_KEY_HERE",
        },
      ],
    });
    const findings = scanWorkspaceSecrets([server]);
    expect(findings.some((f) => f.valuePreview.includes("ghp_"))).toBe(true);
    expect(
      findings.some((f) => f.valuePreview.includes("YOUR_BRAVE")),
    ).toBe(false);
  });

  it("sanitizes secrets to env references", () => {
    const server = createEmptyServer({
      name: "openai",
      command: "npx",
      env: [
        {
          id: "1",
          key: "OPENAI_API_KEY",
          value: "sk-abcdefghijklmnopqrstuvwxyz",
        },
      ],
    });
    const [sanitized] = sanitizeWorkspace([server]);
    expect(sanitized.env[0].value).toBe("${OPENAI_API_KEY}");
  });

  it("warns on secrets during validation", () => {
    const server = createEmptyServer({
      name: "github",
      command: "npx",
      env: [{ id: "1", key: "TOKEN", value: "ghp_abcdefghijklmnopqrstuvwx" }],
    });
    const result = validateWorkspace([server]);
    expect(result.valid).toBe(true);
    expect(result.issues.some((i) => i.severity === "warning")).toBe(true);
  });
});

describe("JSON generation and client formats", () => {
  it("generates mcpServers for Claude/Cursor/raw", () => {
    const server = createEmptyServer({
      name: "filesystem",
      command: "npx",
      args: [{ id: "1", value: "-y" }],
    });
    expect(generateConfig([server], "claude-desktop")).toHaveProperty(
      "mcpServers",
    );
    expect(generateConfig([server], "cursor")).toHaveProperty("mcpServers");
    expect(generateConfig([server], "raw")).toHaveProperty("mcpServers");
  });

  it("generates context_servers for Zed", () => {
    const server = createEmptyServer({
      name: "filesystem",
      command: "npx",
    });
    expect(generateConfig([server], "zed")).toHaveProperty("context_servers");
  });

  it("exports SSE URL configurations", () => {
    const server = createEmptyServer({
      name: "remote",
      transport: "sse",
      url: "https://example.com/sse",
      headers: [{ id: "1", key: "Authorization", value: "Bearer ${TOKEN}" }],
    });
    const json = JSON.parse(generateConfigJson([server], "cursor"));
    expect(json.mcpServers.remote.url).toBe("https://example.com/sse");
    expect(json.mcpServers.remote.headers.Authorization).toContain("Bearer");
  });

  it("returns expected download filenames", () => {
    expect(getDownloadFilename("claude-desktop")).toBe(
      "claude_desktop_config.json",
    );
    expect(getDownloadFilename("cursor")).toBe("cursor-mcp.json");
    expect(getDownloadFilename("zed")).toBe("zed-mcp.json");
    expect(getDownloadFilename("raw")).toBe("mcp-config.json");
  });

  it("computes stats for multi-server configs", () => {
    const servers = [
      createEmptyServer({ name: "a", command: "npx" }),
      createEmptyServer({ name: "b", command: "npx", enabled: false }),
    ];
    const json = generateConfigJson(servers, "raw");
    const stats = computeConfigStats(json, servers);
    expect(stats.activeServers).toBe(1);
    expect(stats.disabledServers).toBe(1);
    expect(stats.lines).toBeGreaterThan(1);
    expect(stats.bytes).toBeGreaterThan(0);
  });
});

describe("import JSON", () => {
  it("imports mcpServers into editor definitions", () => {
    const raw = JSON.stringify({
      mcpServers: {
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem"],
          env: { FOO: "bar" },
        },
      },
    });
    const { result, servers } = validateImportedJson(raw);
    expect(result.valid).toBe(true);
    expect(servers).toHaveLength(1);
    expect(servers[0].name).toBe("filesystem");
    expect(servers[0].args.map((a) => a.value)).toEqual([
      "-y",
      "@modelcontextprotocol/server-filesystem",
    ]);
  });

  it("imports Zed context_servers", () => {
    const raw = JSON.stringify({
      context_servers: {
        remote: { url: "https://example.com/mcp" },
      },
    });
    const { result, servers } = validateImportedJson(raw);
    expect(result.valid).toBe(true);
    expect(servers[0].transport).toBe("sse");
    expect(servers[0].url).toBe("https://example.com/mcp");
  });

  it("handles special characters in args", () => {
    const server = createEmptyServer({
      name: "paths",
      command: "npx",
      args: [
        { id: "1", value: "/Users/名前/Desktop" },
        { id: "2", value: "C:\\Users\\Me\\Projects" },
      ],
    });
    const json = generateConfigJson([server], "raw");
    expect(json).toContain("名前");
    expect(JSON.parse(json).mcpServers.paths.args[1]).toContain("Projects");
  });
});
