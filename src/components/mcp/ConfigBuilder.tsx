"use client";

import { useMemo } from "react";
import { useMcpWorkspace } from "@/hooks/useMcpWorkspace";
import { scanWorkspaceSecrets } from "@/lib/mcp/secretScanner";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ClientTargetSelector } from "@/components/mcp/ClientTargetSelector";
import { PresetSelector } from "@/components/mcp/PresetSelector";
import { ServerList } from "@/components/mcp/ServerList";
import { ServerEditor } from "@/components/mcp/ServerEditor";
import { GeneratedConfig } from "@/components/mcp/GeneratedConfig";
import { ImportJson } from "@/components/mcp/ImportJson";
import { Badge } from "@/components/ui/Badge";

export function ConfigBuilder() {
  const api = useMcpWorkspace();
  const secretFindings = useMemo(
    () => scanWorkspaceSecrets(api.servers.filter((s) => s.enabled)),
    [api.servers],
  );

  return (
    <section
      id="generator"
      className="scroll-mt-24"
      aria-labelledby="generator-heading"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="teal">Interactive workspace</Badge>
            <Badge tone="coral">HiMat Technology</Badge>
          </div>
          <h2
            id="generator-heading"
            className="mt-3 bg-gradient-to-r from-teal-200 via-white to-orange-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl"
          >
            MCP configuration builder
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Configure servers on the left. Review validated JSON on the right.
            All processing stays in browser memory.
          </p>
        </div>
        <Badge tone="success">100% Browser-Local Processing</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card>
          <CardHeader
            title="Configuration editor"
            description={api.clientMeta.pathHint}
          />
          <CardBody className="space-y-8">
            <ClientTargetSelector
              value={api.clientTarget}
              onChange={api.selectClient}
            />
            <PresetSelector
              onAddPreset={api.addPreset}
              onImport={() => api.setImportOpen(true)}
              onAddCustom={api.addCustomServer}
            />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-100">
                Active servers
              </h3>
              <ServerList
                servers={api.servers}
                selectedId={api.selectedServerId}
                onSelect={api.setSelectedServerId}
              />
            </div>
            <ServerEditor
              server={api.selectedServer}
              onChange={api.updateSelected}
              onDelete={api.removeSelectedServer}
              onAddArgument={api.handleAddArgument}
              onUpdateArgument={api.handleUpdateArgument}
              onRemoveArgument={api.handleRemoveArgument}
              onAddEnv={api.handleAddEnv}
              onUpdateEnv={api.handleUpdateEnv}
              onRemoveEnv={api.handleRemoveEnv}
              onAddHeader={api.handleAddHeader}
              onUpdateHeader={api.handleUpdateHeader}
              onRemoveHeader={api.handleRemoveHeader}
            />
          </CardBody>
        </Card>

        <GeneratedConfig
          json={api.json}
          validation={api.validation}
          stats={api.stats}
          secretFindings={secretFindings}
          copied={api.copied}
          copyError={api.copyError}
          onCopy={api.copyConfig}
          onDownload={api.download}
          onSanitize={api.sanitizeSecrets}
        />
      </div>

      <ImportJson
        open={api.importOpen}
        error={api.importError}
        onClose={() => api.setImportOpen(false)}
        onImport={api.importJson}
        onClearError={() => api.setImportError(null)}
      />
    </section>
  );
}
