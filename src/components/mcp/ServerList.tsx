"use client";

import type { McpServerDefinition } from "@/types/mcp";
import { Badge } from "@/components/ui/Badge";

export function ServerList({
  servers,
  selectedId,
  onSelect,
}: {
  servers: McpServerDefinition[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (servers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-8 text-center">
        <p className="text-sm font-medium text-slate-200">No servers yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Add a preset or create a custom server to begin.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="listbox"
      aria-label="Configured MCP servers"
    >
      {servers.map((server) => {
        const selected = server.id === selectedId;
        return (
          <button
            key={server.id}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(server.id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
              selected
                ? "border-teal-500/50 bg-teal-500/10 text-teal-50"
                : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500"
            }`}
          >
            <span className="font-medium">{server.name || "unnamed"}</span>
            {!server.enabled ? <Badge tone="warning">disabled</Badge> : null}
            <Badge tone={server.transport === "sse" ? "info" : "teal"}>
              {server.transport.toUpperCase()}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
