import type { ClientTarget, McpServerDefinition } from "@/types/mcp";
import {
  generateConfigJson,
  getDownloadFilename,
} from "@/lib/mcp/generators";

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy approach
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function downloadJsonFile(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportConfigFile(
  servers: McpServerDefinition[],
  target: ClientTarget,
): { filename: string; contents: string } {
  const contents = generateConfigJson(servers, target);
  const filename = getDownloadFilename(target);
  return { filename, contents };
}

export function downloadConfig(
  servers: McpServerDefinition[],
  target: ClientTarget,
): void {
  const { filename, contents } = exportConfigFile(servers, target);
  downloadJsonFile(filename, contents);
}
