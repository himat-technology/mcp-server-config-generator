"use client";

import type { SecretFinding } from "@/types/mcp";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function SecretScanner({
  findings,
  onSanitize,
}: {
  findings: SecretFinding[];
  onSanitize: () => void;
}) {
  if (findings.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-xs text-slate-400">
        No potential secrets detected in the current configuration.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Badge tone="warning">⚠️ Potential secret detected</Badge>
          <span className="text-xs text-amber-200/80">
            {findings.length} finding{findings.length === 1 ? "" : "s"}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onSanitize}>
          Sanitize secrets
        </Button>
      </div>
      <ul className="space-y-2">
        {findings.map((finding) => (
          <li key={finding.id} className="text-xs text-amber-100/90">
            <span className="font-medium">{finding.path}</span>
            <span className="text-amber-200/70">
              {" "}
              · {finding.pattern} · {finding.valuePreview}
            </span>
            <div className="mt-0.5 text-amber-200/60">
              Recommend: {finding.recommendation}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
