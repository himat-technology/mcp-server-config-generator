export type TransportType = "stdio" | "sse";

export type CommandRunner =
  | "npx"
  | "node"
  | "python"
  | "docker"
  | "uvx"
  | "custom";

export type ClientTarget =
  | "claude-desktop"
  | "cursor"
  | "zed"
  | "raw";

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
}

export interface ArgumentItem {
  id: string;
  value: string;
}

export interface McpServerDefinition {
  id: string;
  name: string;
  enabled: boolean;
  transport: TransportType;
  commandRunner: CommandRunner;
  command: string;
  args: ArgumentItem[];
  env: EnvVariable[];
  url: string;
  headers: EnvVariable[];
}

export interface StdioServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface SseServerConfig {
  url: string;
  headers?: Record<string, string>;
  env?: Record<string, string>;
}

export type ExportedServerConfig = StdioServerConfig | SseServerConfig;

export interface McpServersObject {
  mcpServers: Record<string, ExportedServerConfig>;
}

export interface ZedContextServersObject {
  context_servers: Record<string, ExportedServerConfig>;
}

export type GeneratedConfig =
  | McpServersObject
  | ZedContextServersObject
  | Record<string, ExportedServerConfig>;

export type ValidationSeverity = "error" | "warning" | "success" | "info";

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  path?: string;
  line?: number;
  serverName?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface SecretFinding {
  id: string;
  serverName: string;
  path: string;
  key: string;
  valuePreview: string;
  pattern: string;
  recommendation: string;
}

export interface ConfigStats {
  bytes: number;
  kilobytes: number;
  lines: number;
  activeServers: number;
  totalServers: number;
  disabledServers: number;
}

export interface PresetDefinition {
  id: string;
  label: string;
  description: string;
  transport: TransportType;
  defaultName: string;
  commandRunner: CommandRunner;
  command: string;
  args: string[];
  env: Record<string, string>;
  url?: string;
}

export interface ClientTargetOption {
  id: ClientTarget;
  label: string;
  filename: string;
  description: string;
  pathHint: string;
}
