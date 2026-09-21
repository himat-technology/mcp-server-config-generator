"use client";

import { useMemo, useState } from "react";
import type {
  ClientTarget,
  McpServerDefinition,
  ValidationResult,
} from "@/types/mcp";
import {
  CLIENT_TARGETS,
  PRESETS,
  addArgument,
  addEnvVariable,
  computeConfigStats,
  copyTextToClipboard,
  createEmptyServer,
  deleteServer,
  downloadConfig,
  generateConfigJson,
  presetToServer,
  removeArgument,
  removeEnvVariable,
  sanitizeWorkspace,
  toggleServerEnabled,
  updateArgument,
  updateEnvVariable,
  upsertServer,
  validateImportedJson,
  validateWorkspace,
} from "@/lib/mcp";
import { COMMAND_RUNNER_DEFAULTS } from "@/lib/mcp/presets";

export function useMcpWorkspace() {
  const [clientTarget, setClientTarget] =
    useState<ClientTarget>("claude-desktop");
  const [servers, setServers] = useState<McpServerDefinition[]>(() => [
    presetToServer(PRESETS[0]),
    presetToServer(PRESETS[1], [PRESETS[0].defaultName]),
  ]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(
    null,
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const activeSelectedId =
    selectedServerId && servers.some((s) => s.id === selectedServerId)
      ? selectedServerId
      : (servers[0]?.id ?? null);

  const selectedServer =
    servers.find((server) => server.id === activeSelectedId) ?? null;

  const json = useMemo(
    () => generateConfigJson(servers, clientTarget),
    [servers, clientTarget],
  );

  const validation: ValidationResult = useMemo(
    () => validateWorkspace(servers, json),
    [servers, json],
  );

  const stats = useMemo(
    () => computeConfigStats(json, servers),
    [json, servers],
  );

  const clientMeta =
    CLIENT_TARGETS.find((item) => item.id === clientTarget) ??
    CLIENT_TARGETS[0];

  function selectClient(target: ClientTarget) {
    setClientTarget(target);
  }

  function addPreset(presetId: string) {
    const preset = PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    const names = servers.map((s) => s.name);
    const server = presetToServer(preset, names);
    setServers((prev) => [...prev, server]);
    setSelectedServerId(server.id);
  }

  function addCustomServer() {
    const names = servers.map((s) => s.name);
    let name = "custom-server";
    let counter = 2;
    while (names.includes(name)) {
      name = `custom-server-${counter}`;
      counter += 1;
    }
    const server = createEmptyServer({
      name,
      args: [],
      command: "npx",
      commandRunner: "npx",
    });
    setServers((prev) => [...prev, server]);
    setSelectedServerId(server.id);
  }

  function updateSelected(patch: Partial<McpServerDefinition>) {
    if (!selectedServer) return;
    const next: McpServerDefinition = {
      ...selectedServer,
      ...patch,
      ...(patch.commandRunner && patch.commandRunner !== "custom"
        ? { command: COMMAND_RUNNER_DEFAULTS[patch.commandRunner] }
        : {}),
    };

    setServers((prev) => upsertServer(prev, next));
  }

  function removeSelectedServer() {
    if (!selectedServer) return;
    setServers((prev) => deleteServer(prev, selectedServer.id));
    setSelectedServerId(null);
  }

  function setEnabled(id: string, enabled: boolean) {
    setServers((prev) => toggleServerEnabled(prev, id, enabled));
  }

  function handleAddArgument() {
    if (!selectedServer) return;
    updateSelected({ args: addArgument(selectedServer.args) });
  }

  function handleUpdateArgument(id: string, value: string) {
    if (!selectedServer) return;
    updateSelected({
      args: updateArgument(selectedServer.args, id, value),
    });
  }

  function handleRemoveArgument(id: string) {
    if (!selectedServer) return;
    updateSelected({
      args: removeArgument(selectedServer.args, id),
    });
  }

  function handleAddEnv() {
    if (!selectedServer) return;
    updateSelected({ env: addEnvVariable(selectedServer.env) });
  }

  function handleUpdateEnv(
    id: string,
    patch: Partial<{ key: string; value: string }>,
  ) {
    if (!selectedServer) return;
    updateSelected({
      env: updateEnvVariable(selectedServer.env, id, patch),
    });
  }

  function handleRemoveEnv(id: string) {
    if (!selectedServer) return;
    updateSelected({
      env: removeEnvVariable(selectedServer.env, id),
    });
  }

  function handleAddHeader() {
    if (!selectedServer) return;
    updateSelected({ headers: addEnvVariable(selectedServer.headers) });
  }

  function handleUpdateHeader(
    id: string,
    patch: Partial<{ key: string; value: string }>,
  ) {
    if (!selectedServer) return;
    updateSelected({
      headers: updateEnvVariable(selectedServer.headers, id, patch),
    });
  }

  function handleRemoveHeader(id: string) {
    if (!selectedServer) return;
    updateSelected({
      headers: removeEnvVariable(selectedServer.headers, id),
    });
  }

  function sanitizeSecrets() {
    setServers((prev) => sanitizeWorkspace(prev));
  }

  function importJson(raw: string): boolean {
    const { result, servers: imported } = validateImportedJson(raw);
    if (!result.valid || imported.length === 0) {
      const firstError =
        result.issues.find((item) => item.severity === "error")?.message ??
        "Import failed";
      setImportError(firstError);
      return false;
    }
    setServers(imported);
    setSelectedServerId(imported[0]?.id ?? null);
    setImportError(null);
    setImportOpen(false);
    return true;
  }

  async function copyConfig() {
    const ok = await copyTextToClipboard(json);
    if (!ok) {
      setCopyError("Clipboard access failed. Select and copy the JSON manually.");
      setCopied(false);
      return;
    }
    setCopyError(null);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function download() {
    downloadConfig(servers, clientTarget);
  }

  return {
    clientTarget,
    clientMeta,
    servers,
    selectedServer,
    selectedServerId: activeSelectedId,
    setSelectedServerId,
    json,
    validation,
    stats,
    importOpen,
    setImportOpen,
    importError,
    setImportError,
    copied,
    copyError,
    selectClient,
    addPreset,
    addCustomServer,
    updateSelected,
    removeSelectedServer,
    setEnabled,
    handleAddArgument,
    handleUpdateArgument,
    handleRemoveArgument,
    handleAddEnv,
    handleUpdateEnv,
    handleRemoveEnv,
    handleAddHeader,
    handleUpdateHeader,
    handleRemoveHeader,
    sanitizeSecrets,
    importJson,
    copyConfig,
    download,
  };
}

export type McpWorkspaceApi = ReturnType<typeof useMcpWorkspace>;
