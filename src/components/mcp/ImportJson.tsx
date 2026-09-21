"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export function ImportJson({
  open,
  error,
  onClose,
  onImport,
  onClearError,
}: {
  open: boolean;
  error: string | null;
  onClose: () => void;
  onImport: (raw: string) => boolean;
  onClearError: () => void;
}) {
  const [raw, setRaw] = useState("");

  function handleImport() {
    const ok = onImport(raw);
    if (ok) setRaw("");
  }

  return (
    <Dialog
      open={open}
      title="Import JSON"
      description="Paste an existing mcpServers or Zed context_servers config. Parsing and validation run entirely in your browser."
      onClose={() => {
        onClearError();
        onClose();
      }}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              onClearError();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleImport}>Parse & Import</Button>
        </div>
      }
    >
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-slate-200">Configuration JSON</span>
        <textarea
          value={raw}
          onChange={(event) => {
            onClearError();
            setRaw(event.target.value);
          }}
          rows={14}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 p-3 font-mono text-xs text-slate-100 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          placeholder={`{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-filesystem"]\n    }\n  }\n}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "import-json-error" : undefined}
        />
      </label>
      {error ? (
        <p id="import-json-error" className="mt-3 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </Dialog>
  );
}
