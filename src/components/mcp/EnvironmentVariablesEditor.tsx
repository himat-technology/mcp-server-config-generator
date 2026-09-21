"use client";

import type { EnvVariable } from "@/types/mcp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function EnvironmentVariablesEditor({
  env,
  title = "Environment Variables (`env`)",
  emptyLabel = "No environment variables defined for this server.",
  onAdd,
  onChange,
  onRemove,
}: {
  env: EnvVariable[];
  title?: string;
  emptyLabel?: string;
  onAdd: () => void;
  onChange: (id: string, patch: Partial<{ key: string; value: string }>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
          <p className="text-xs text-slate-500">
            KEY → VALUE pairs stay local in browser memory.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAdd}>
          Add Env Var
        </Button>
      </div>
      {env.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700 px-3 py-4 text-xs text-slate-500">
          {emptyLabel}
        </p>
      ) : (
        <ul className="space-y-2">
          {env.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]"
            >
              <Input
                aria-label="Environment variable key"
                placeholder="KEY"
                value={item.key}
                onChange={(event) =>
                  onChange(item.id, { key: event.target.value })
                }
              />
              <Input
                aria-label="Environment variable value"
                placeholder="VALUE"
                value={item.value}
                onChange={(event) =>
                  onChange(item.id, { value: event.target.value })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.key || "environment variable"}`}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
