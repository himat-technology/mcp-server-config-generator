"use client";

import type { ConfigStats } from "@/types/mcp";

export function ConfigStats({ stats }: { stats: ConfigStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Config Size
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-100">
          {stats.kilobytes.toFixed(2)} KB{" "}
          <span className="font-normal text-slate-500">
            ({stats.bytes} bytes)
          </span>
        </p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Config Lines & Servers
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-100">
          {stats.lines} lines / {stats.activeServers} active servers
          {stats.disabledServers > 0 ? (
            <span className="font-normal text-slate-500">
              {" "}
              ({stats.disabledServers} disabled)
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
