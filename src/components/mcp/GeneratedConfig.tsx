"use client";

import type { ConfigStats, SecretFinding, ValidationResult } from "@/types/mcp";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ConfigStats as ConfigStatsPanel } from "@/components/mcp/ConfigStats";
import { SecretScanner } from "@/components/mcp/SecretScanner";
import { ValidationStatus } from "@/components/mcp/ValidationStatus";

function highlightJson(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "text-amber-300";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "text-sky-300" : "text-emerald-300";
        } else if (/true|false/.test(match)) {
          cls = "text-violet-300";
        } else if (/null/.test(match)) {
          cls = "text-slate-400";
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );
}

export function GeneratedConfig({
  json,
  validation,
  stats,
  secretFindings,
  copied,
  copyError,
  onCopy,
  onDownload,
  onSanitize,
}: {
  json: string;
  validation: ValidationResult;
  stats: ConfigStats;
  secretFindings: SecretFinding[];
  copied: boolean;
  copyError: string | null;
  onCopy: () => void;
  onDownload: () => void;
  onSanitize: () => void;
}) {
  return (
    <Card className="lg:sticky lg:top-6">
      <CardHeader
        title="Generated Config JSON"
        description="Live preview updates instantly as you edit. Nothing is uploaded."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={onCopy}>
              {copied ? "Copied!" : "Copy Config"}
            </Button>
            <Button size="sm" onClick={onDownload}>
              Download JSON
            </Button>
          </div>
        }
      />
      <CardBody className="space-y-4">
        <ValidationStatus validation={validation} />
        <SecretScanner findings={secretFindings} onSanitize={onSanitize} />
        {copyError ? (
          <p className="text-xs text-rose-300" role="alert">
            {copyError}
          </p>
        ) : null}
        <pre
          className="max-h-[28rem] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-200"
          tabIndex={0}
          aria-label="Generated MCP configuration JSON"
        >
          <code
            className="font-mono whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlightJson(json) }}
          />
        </pre>
        <ConfigStatsPanel stats={stats} />
      </CardBody>
    </Card>
  );
}
