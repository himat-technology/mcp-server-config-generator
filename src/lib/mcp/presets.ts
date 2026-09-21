import type { ClientTargetOption, PresetDefinition } from "@/types/mcp";
import {
  argsArrayToList,
  createEmptyServer,
  createId,
  envRecordToList,
} from "@/lib/mcp/types";
import type { McpServerDefinition } from "@/types/mcp";

export const CLIENT_TARGETS: ClientTargetOption[] = [
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    filename: "claude_desktop_config.json",
    description: "claude_desktop_config.json",
    pathHint:
      "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json · Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
  },
  {
    id: "cursor",
    label: "Cursor",
    filename: "cursor-mcp.json",
    description: ".cursor/mcp.json",
    pathHint:
      "Project: .cursor/mcp.json · Global: ~/.cursor/mcp.json (paths may vary by OS/version)",
  },
  {
    id: "zed",
    label: "Zed",
    filename: "zed-mcp.json",
    description: "settings.json (context_servers)",
    pathHint:
      "Zed settings.json → context_servers (open via zed: open settings file)",
  },
  {
    id: "raw",
    label: "Raw mcpServers",
    filename: "mcp-config.json",
    description: "Raw mcpServers object",
    pathHint: "Use as a portable mcpServers block for custom agents",
  },
];

export const PRESETS: PresetDefinition[] = [
  {
    id: "filesystem",
    label: "Filesystem",
    description: "Local filesystem access via MCP",
    transport: "stdio",
    defaultName: "filesystem",
    commandRunner: "npx",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/username/Desktop",
      "/Users/username/Projects",
    ],
    env: {},
  },
  {
    id: "brave-search",
    label: "Brave Search",
    description: "Web search with Brave Search API",
    transport: "stdio",
    defaultName: "brave-search",
    commandRunner: "npx",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-brave-search"],
    env: {
      BRAVE_API_KEY: "YOUR_BRAVE_API_KEY_HERE",
    },
  },
  {
    id: "memory",
    label: "Memory",
    description: "Persistent knowledge graph memory",
    transport: "stdio",
    defaultName: "memory",
    commandRunner: "npx",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-memory"],
    env: {},
  },
  {
    id: "github",
    label: "GitHub",
    description: "GitHub repositories, issues, and PRs",
    transport: "stdio",
    defaultName: "github",
    commandRunner: "npx",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: "YOUR_GITHUB_PAT_HERE",
    },
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    description: "Read-only PostgreSQL database access",
    transport: "stdio",
    defaultName: "postgres",
    commandRunner: "npx",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-postgres",
      "postgresql://localhost/mydb",
    ],
    env: {},
  },
  {
    id: "fetch",
    label: "Fetch",
    description: "Fetch and convert web content",
    transport: "stdio",
    defaultName: "fetch",
    commandRunner: "npx",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-fetch"],
    env: {},
  },
  {
    id: "puppeteer",
    label: "Puppeteer",
    description: "Browser automation with Puppeteer",
    transport: "stdio",
    defaultName: "puppeteer",
    commandRunner: "npx",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-puppeteer"],
    env: {},
  },
  {
    id: "custom-stdio",
    label: "Custom STDIO",
    description: "Blank STDIO server template",
    transport: "stdio",
    defaultName: "custom-stdio",
    commandRunner: "npx",
    command: "npx",
    args: ["-y", "your-mcp-package"],
    env: {},
  },
  {
    id: "custom-sse",
    label: "Custom SSE",
    description: "Blank SSE / URL-based server template",
    transport: "sse",
    defaultName: "custom-sse",
    commandRunner: "npx",
    command: "",
    args: [],
    env: {},
    url: "https://example.com/sse",
  },
];

export function presetToServer(
  preset: PresetDefinition,
  existingNames: string[] = [],
): McpServerDefinition {
  let name = preset.defaultName;
  if (existingNames.includes(name)) {
    let counter = 2;
    while (existingNames.includes(`${preset.defaultName}-${counter}`)) {
      counter += 1;
    }
    name = `${preset.defaultName}-${counter}`;
  }

  return createEmptyServer({
    id: createId("server"),
    name,
    enabled: true,
    transport: preset.transport,
    commandRunner: preset.commandRunner,
    command: preset.command,
    args: argsArrayToList(preset.args),
    env: envRecordToList(preset.env),
    url: preset.url ?? "",
    headers: [],
  });
}

export const COMMAND_RUNNER_DEFAULTS: Record<
  Exclude<import("@/types/mcp").CommandRunner, "custom">,
  string
> = {
  npx: "npx",
  node: "node",
  python: "python",
  docker: "docker",
  uvx: "uvx",
};
