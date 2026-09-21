import type {
  ExportedServerConfig,
  GeneratedConfig,
  McpServerDefinition,
  SseServerConfig,
  StdioServerConfig,
} from "@/types/mcp";
import {
  argsListToArray,
  envListToRecord,
} from "@/lib/mcp/types";
import type { ClientTarget } from "@/types/mcp";

export function toExportedServer(
  server: McpServerDefinition,
): ExportedServerConfig {
  if (server.transport === "sse") {
    const config: SseServerConfig = {
      url: server.url.trim(),
    };
    const headers = envListToRecord(server.headers);
    if (Object.keys(headers).length > 0) {
      config.headers = headers;
    }
    const env = envListToRecord(server.env);
    if (Object.keys(env).length > 0) {
      config.env = env;
    }
    return config;
  }

  const config: StdioServerConfig = {
    command: server.command.trim(),
  };
  const args = argsListToArray(server.args);
  if (args.length > 0) {
    config.args = args;
  }
  const env = envListToRecord(server.env);
  if (Object.keys(env).length > 0) {
    config.env = env;
  }
  return config;
}

export function buildServersRecord(
  servers: McpServerDefinition[],
): Record<string, ExportedServerConfig> {
  const result: Record<string, ExportedServerConfig> = {};
  for (const server of servers) {
    if (!server.enabled) continue;
    const name = server.name.trim();
    if (!name) continue;
    result[name] = toExportedServer(server);
  }
  return result;
}

export function generateConfig(
  servers: McpServerDefinition[],
  target: ClientTarget,
): GeneratedConfig {
  const mcpServers = buildServersRecord(servers);

  switch (target) {
    case "zed":
      return { context_servers: mcpServers };
    case "raw":
    case "claude-desktop":
    case "cursor":
    default:
      return { mcpServers };
  }
}

export function generateConfigJson(
  servers: McpServerDefinition[],
  target: ClientTarget,
  space = 2,
): string {
  return `${JSON.stringify(generateConfig(servers, target), null, space)}\n`;
}

export function getDownloadFilename(target: ClientTarget): string {
  switch (target) {
    case "claude-desktop":
      return "claude_desktop_config.json";
    case "cursor":
      return "cursor-mcp.json";
    case "zed":
      return "zed-mcp.json";
    case "raw":
    default:
      return "mcp-config.json";
  }
}

export function computeConfigStats(
  json: string,
  servers: McpServerDefinition[],
): {
  bytes: number;
  kilobytes: number;
  lines: number;
  activeServers: number;
  totalServers: number;
  disabledServers: number;
} {
  const bytes = new TextEncoder().encode(json).length;
  const activeServers = servers.filter(
    (s) => s.enabled && s.name.trim().length > 0,
  ).length;
  const disabledServers = servers.filter((s) => !s.enabled).length;

  return {
    bytes,
    kilobytes: Math.round((bytes / 1024) * 100) / 100,
    lines: json.length === 0 ? 0 : json.split("\n").length,
    activeServers,
    totalServers: servers.length,
    disabledServers,
  };
}
