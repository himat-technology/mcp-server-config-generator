"use client";

import type { ArgumentItem } from "@/types/mcp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ArgumentsEditor({
  args,
  onAdd,
  onChange,
  onRemove,
}: {
  args: ArgumentItem[];
  onAdd: () => void;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">
            Command Arguments (`args`)
          </h4>
          <p className="text-xs text-slate-500">
            Add flags, package names, and paths dynamically.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAdd}>
          Add Argument
        </Button>
      </div>
      {args.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700 px-3 py-4 text-xs text-slate-500">
          No arguments defined for this server.
        </p>
      ) : (
        <ul className="space-y-2">
          {args.map((arg, index) => (
            <li key={arg.id} className="flex items-end gap-2">
              <div className="w-8 shrink-0 pb-2 text-xs text-slate-500">
                {index + 1}.
              </div>
              <Input
                aria-label={`Argument ${index + 1}`}
                placeholder="e.g. -y or package-name"
                value={arg.value}
                onChange={(event) => onChange(arg.id, event.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(arg.id)}
                aria-label={`Remove argument ${index + 1}`}
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
