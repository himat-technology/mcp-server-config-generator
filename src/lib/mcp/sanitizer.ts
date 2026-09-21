import type { McpServerDefinition } from "@/types/mcp";
import { sanitizeServer, scanWorkspaceSecrets } from "@/lib/mcp/secretScanner";

export { sanitizeServer, sanitizeEnvValue } from "@/lib/mcp/secretScanner";

export function sanitizeWorkspace(
  servers: McpServerDefinition[],
): McpServerDefinition[] {
  return servers.map(sanitizeServer);
}

export function getSanitizationSummary(servers: McpServerDefinition[]): {
  findings: ReturnType<typeof scanWorkspaceSecrets>;
  sanitized: McpServerDefinition[];
} {
  return {
    findings: scanWorkspaceSecrets(servers),
    sanitized: sanitizeWorkspace(servers),
  };
}
