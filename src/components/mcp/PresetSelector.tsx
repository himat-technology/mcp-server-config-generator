"use client";

import { PRESETS } from "@/lib/mcp/presets";
import { Button } from "@/components/ui/Button";

export function PresetSelector({
  onAddPreset,
  onImport,
  onAddCustom,
}: {
  onAddPreset: (presetId: string) => void;
  onImport: () => void;
  onAddCustom: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Add Presets</h3>
          <p className="mt-1 text-xs text-slate-400">
            One-click official and community server starters.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onImport}>
            Import JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={onAddCustom}>
            New Server
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            onClick={() => onAddPreset(preset.id)}
            aria-label={`Add ${preset.label} preset`}
            title={preset.description}
          >
            + {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
