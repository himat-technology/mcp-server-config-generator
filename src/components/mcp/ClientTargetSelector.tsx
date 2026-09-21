"use client";

import { CLIENT_TARGETS } from "@/lib/mcp/presets";
import type { ClientTarget } from "@/types/mcp";
import { Tabs } from "@/components/ui/Tabs";

export function ClientTargetSelector({
  value,
  onChange,
}: {
  value: ClientTarget;
  onChange: (value: ClientTarget) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">
          Select Client Target Format
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Output JSON reshapes for Claude Desktop, Cursor, Zed, or a raw
          mcpServers object.
        </p>
      </div>
      <Tabs
        label="Client target format"
        value={value}
        onChange={onChange}
        options={CLIENT_TARGETS.map((target) => ({
          value: target.id,
          label: target.label,
          description: target.description,
        }))}
      />
    </div>
  );
}
