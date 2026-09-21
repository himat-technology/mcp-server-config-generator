"use client";

import type { ReactNode } from "react";

export function Tabs<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: Array<{ value: T; label: ReactNode; description?: string }>;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
              selected
                ? "border-cyan-400/60 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-sky-500/20 text-cyan-50 shadow-md shadow-cyan-500/10"
                : "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-orange-400/40 hover:bg-orange-500/5"
            }`}
            onClick={() => onChange(option.value)}
          >
            <span className="font-medium">{option.label}</span>
            {option.description ? (
              <span className="mt-0.5 block text-xs text-slate-400">
                {option.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
