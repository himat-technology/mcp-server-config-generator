"use client";

import type { TransportType } from "@/types/mcp";
import { Tabs } from "@/components/ui/Tabs";

export function TransportSelector({
  value,
  onChange,
}: {
  value: TransportType;
  onChange: (value: TransportType) => void;
}) {
  return (
    <Tabs
      label="Transport type"
      value={value}
      onChange={onChange}
      options={[
        {
          value: "stdio",
          label: "STDIO",
          description: "Local command runner",
        },
        {
          value: "sse",
          label: "SSE",
          description: "URL-based remote server",
        },
      ]}
    />
  );
}
