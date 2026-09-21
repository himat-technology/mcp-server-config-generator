export type {
  ArgumentItem,
  ClientTarget,
  ClientTargetOption,
  CommandRunner,
  ConfigStats,
  EnvVariable,
  ExportedServerConfig,
  GeneratedConfig,
  McpServerDefinition,
  McpServersObject,
  PresetDefinition,
  SecretFinding,
  SseServerConfig,
  StdioServerConfig,
  TransportType,
  ValidationIssue,
  ValidationResult,
  ValidationSeverity,
  ZedContextServersObject,
} from "@/types/mcp";

export function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyServer(
  overrides: Partial<import("@/types/mcp").McpServerDefinition> = {},
): import("@/types/mcp").McpServerDefinition {
  return {
    id: createId("server"),
    name: "custom-server",
    enabled: true,
    transport: "stdio",
    commandRunner: "npx",
    command: "npx",
    args: [],
    env: [],
    url: "",
    headers: [],
    ...overrides,
  };
}

export function envRecordToList(
  env: Record<string, string> = {},
): import("@/types/mcp").EnvVariable[] {
  return Object.entries(env).map(([key, value]) => ({
    id: createId("env"),
    key,
    value,
  }));
}

export function argsArrayToList(
  args: string[] = [],
): import("@/types/mcp").ArgumentItem[] {
  return args.map((value) => ({
    id: createId("arg"),
    value,
  }));
}

export function envListToRecord(
  env: import("@/types/mcp").EnvVariable[],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const item of env) {
    const key = item.key.trim();
    if (!key) continue;
    result[key] = item.value;
  }
  return result;
}

export function argsListToArray(
  args: import("@/types/mcp").ArgumentItem[],
): string[] {
  return args.map((item) => item.value).filter((value) => value.length > 0);
}
