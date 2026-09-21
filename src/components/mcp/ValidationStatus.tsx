"use client";

import type { ValidationResult } from "@/types/mcp";
import { Badge } from "@/components/ui/Badge";

export function ValidationStatus({
  validation,
}: {
  validation: ValidationResult;
}) {
  const tone = validation.valid ? "success" : "danger";

  return (
    <div
      className="space-y-2"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={tone}>
          {validation.valid ? "Valid MCP Spec" : "Invalid configuration"}
        </Badge>
      </div>
      <ul className="space-y-1.5">
        {validation.issues.map((item) => (
          <li
            key={item.id}
            className={`text-xs leading-relaxed ${
              item.severity === "error"
                ? "text-rose-300"
                : item.severity === "warning"
                  ? "text-amber-300"
                  : item.severity === "success"
                    ? "text-emerald-300"
                    : "text-slate-400"
            }`}
          >
            {item.message}
            {item.line ? (
              <span className="text-slate-500"> (line {item.line})</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
