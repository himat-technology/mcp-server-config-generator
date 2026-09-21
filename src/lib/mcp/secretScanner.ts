import type { SecretFinding, McpServerDefinition } from "@/types/mcp";
import { createId } from "@/lib/mcp/types";

const SECRET_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: "OpenAI-style key", regex: /\bsk-[A-Za-z0-9_-]{10,}\b/ },
  { name: "GitHub PAT (classic)", regex: /\bghp_[A-Za-z0-9]{20,}\b/ },
  { name: "GitHub fine-grained PAT", regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: "Bearer token", regex: /\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b/i },
  { name: "AWS access key", regex: /\bAKIA[0-9A-Z]{16}\b/ },
  {
    name: "Slack token",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  },
  {
    name: "Generic API key shape",
    regex: /\b(?:api[_-]?key|access[_-]?token|private[_-]?token|secret[_-]?key)\b/i,
  },
  {
    name: "Password-like key",
    regex: /\b(?:password|passwd|db_password|database_password)\b/i,
  },
  {
    name: "Connection string with credentials",
    regex:
      /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"']+:[^\s"']+@/i,
  },
  {
    name: "Long high-entropy token",
    regex: /\b[A-Za-z0-9_\-+/=]{40,}\b/,
  },
];

const PLACEHOLDER_HINTS = [
  "YOUR_",
  "_HERE",
  "EXAMPLE",
  "PLACEHOLDER",
  "CHANGEME",
  "${",
  "<",
];

function isLikelyPlaceholder(value: string): boolean {
  const upper = value.toUpperCase();
  return PLACEHOLDER_HINTS.some((hint) => upper.includes(hint.toUpperCase()));
}

function previewValue(value: string): string {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function matchesSecretPattern(
  key: string,
  value: string,
): { name: string; regex: RegExp } | null {
  if (!value.trim() || isLikelyPlaceholder(value)) {
    return null;
  }

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.name.includes("key") || pattern.name.includes("Password")) {
      if (pattern.regex.test(key) && value.trim().length >= 8) {
        return pattern;
      }
    }
    if (pattern.regex.test(value)) {
      // Avoid flagging every long path/package string as a secret
      if (pattern.name === "Long high-entropy token") {
        if (
          value.includes("/") ||
          value.includes("@") ||
          value.startsWith("-") ||
          /^[a-z0-9.-]+$/i.test(value)
        ) {
          continue;
        }
      }
      if (pattern.name === "Generic API key shape") {
        if (pattern.regex.test(key) && value.trim().length >= 8) {
          return pattern;
        }
        continue;
      }
      if (pattern.name === "Password-like key") {
        if (pattern.regex.test(key) && value.trim().length >= 4) {
          return pattern;
        }
        continue;
      }
      return pattern;
    }
  }

  return null;
}

export function scanServerSecrets(
  server: McpServerDefinition,
): SecretFinding[] {
  const findings: SecretFinding[] = [];

  for (const env of server.env) {
    const match = matchesSecretPattern(env.key, env.value);
    if (!match) continue;
    findings.push({
      id: createId("secret"),
      serverName: server.name || "(unnamed)",
      path: `mcpServers.${server.name || "server"}.env.${env.key || "(empty)"}`,
      key: env.key || "(empty key)",
      valuePreview: previewValue(env.value),
      pattern: match.name,
      recommendation: env.key
        ? `Replace with ${env.key}=\${${env.key}}`
        : "Replace the raw secret with an environment variable reference",
    });
  }

  for (const header of server.headers) {
    const match = matchesSecretPattern(header.key, header.value);
    if (!match) continue;
    findings.push({
      id: createId("secret"),
      serverName: server.name || "(unnamed)",
      path: `mcpServers.${server.name || "server"}.headers.${header.key || "(empty)"}`,
      key: header.key || "(empty key)",
      valuePreview: previewValue(header.value),
      pattern: match.name,
      recommendation: header.key
        ? `Replace with ${header.key}=\${${header.key}}`
        : "Replace the raw secret with an environment variable reference",
    });
  }

  if (server.transport === "stdio") {
    for (const arg of server.args) {
      const match = matchesSecretPattern("arg", arg.value);
      if (!match) continue;
      if (match.name === "Connection string with credentials") {
        findings.push({
          id: createId("secret"),
          serverName: server.name || "(unnamed)",
          path: `mcpServers.${server.name || "server"}.args`,
          key: "args",
          valuePreview: previewValue(arg.value),
          pattern: match.name,
          recommendation:
            "Avoid embedding credentials in args; prefer env vars or placeholders",
        });
      }
    }
  }

  return findings;
}

export function scanWorkspaceSecrets(
  servers: McpServerDefinition[],
): SecretFinding[] {
  return servers.flatMap(scanServerSecrets);
}

export function sanitizeEnvValue(key: string, value: string): string {
  if (isLikelyPlaceholder(value)) return value;
  const match = matchesSecretPattern(key, value);
  if (!match) return value;
  if (key.trim()) return `\${${key.trim()}}`;
  return "${SECRET}";
}

export function sanitizeServer(
  server: McpServerDefinition,
): McpServerDefinition {
  return {
    ...server,
    env: server.env.map((item) => ({
      ...item,
      value: sanitizeEnvValue(item.key, item.value),
    })),
    headers: server.headers.map((item) => ({
      ...item,
      value: sanitizeEnvValue(item.key, item.value),
    })),
  };
}
