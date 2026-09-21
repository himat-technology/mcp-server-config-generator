"use client";

import type { CommandRunner, McpServerDefinition } from "@/types/mcp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ArgumentsEditor } from "@/components/mcp/ArgumentsEditor";
import { EnvironmentVariablesEditor } from "@/components/mcp/EnvironmentVariablesEditor";
import { TransportSelector } from "@/components/mcp/TransportSelector";

const RUNNER_OPTIONS: Array<{ value: CommandRunner; label: string }> = [
  { value: "npx", label: "npx" },
  { value: "node", label: "node" },
  { value: "python", label: "python" },
  { value: "docker", label: "docker" },
  { value: "uvx", label: "uvx" },
  { value: "custom", label: "custom command" },
];

export function ServerEditor({
  server,
  onChange,
  onDelete,
  onAddArgument,
  onUpdateArgument,
  onRemoveArgument,
  onAddEnv,
  onUpdateEnv,
  onRemoveEnv,
  onAddHeader,
  onUpdateHeader,
  onRemoveHeader,
}: {
  server: McpServerDefinition | null;
  onChange: (patch: Partial<McpServerDefinition>) => void;
  onDelete: () => void;
  onAddArgument: () => void;
  onUpdateArgument: (id: string, value: string) => void;
  onRemoveArgument: (id: string) => void;
  onAddEnv: () => void;
  onUpdateEnv: (
    id: string,
    patch: Partial<{ key: string; value: string }>,
  ) => void;
  onRemoveEnv: (id: string) => void;
  onAddHeader: () => void;
  onUpdateHeader: (
    id: string,
    patch: Partial<{ key: string; value: string }>,
  ) => void;
  onRemoveHeader: (id: string) => void;
}) {
  if (!server) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-10 text-center">
        <p className="text-sm font-medium text-slate-200">
          Select or create a server
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Use presets or New Server to start configuring.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-50">
            Server: {server.name || "unnamed"}
          </h3>
          <p className="text-xs text-slate-500">
            Disabled servers are excluded from the generated active config.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-teal-500 focus:ring-teal-500/40"
              checked={server.enabled}
              onChange={(event) => onChange({ enabled: event.target.checked })}
            />
            Enabled
          </label>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete server
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Server Name ID"
          placeholder="e.g. filesystem"
          value={server.name}
          onChange={(event) => onChange({ name: event.target.value })}
          hint="Letters, numbers, dots, underscores, and hyphens"
        />
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Transport Type
          </span>
          <TransportSelector
            value={server.transport}
            onChange={(transport) => onChange({ transport })}
          />
        </div>
      </div>

      {server.transport === "stdio" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Command Runner"
            value={server.commandRunner}
            onChange={(event) =>
              onChange({
                commandRunner: event.target.value as CommandRunner,
              })
            }
            options={RUNNER_OPTIONS}
            hint="npx / node / python / docker / uvx"
          />
          <Input
            label="Command"
            placeholder="npx"
            value={server.command}
            onChange={(event) =>
              onChange({
                command: event.target.value,
                commandRunner: "custom",
              })
            }
          />
        </div>
      ) : (
        <Input
          label="SSE URL"
          placeholder="https://example.com/sse"
          value={server.url}
          onChange={(event) => onChange({ url: event.target.value })}
        />
      )}

      {server.transport === "stdio" ? (
        <ArgumentsEditor
          args={server.args}
          onAdd={onAddArgument}
          onChange={onUpdateArgument}
          onRemove={onRemoveArgument}
        />
      ) : (
        <EnvironmentVariablesEditor
          env={server.headers}
          title="Headers"
          emptyLabel="No headers defined for this server."
          onAdd={onAddHeader}
          onChange={onUpdateHeader}
          onRemove={onRemoveHeader}
        />
      )}

      <EnvironmentVariablesEditor
        env={server.env}
        onAdd={onAddEnv}
        onChange={onUpdateEnv}
        onRemove={onRemoveEnv}
      />
    </div>
  );
}
