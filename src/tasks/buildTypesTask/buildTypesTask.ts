import { callTypescript } from "./callTypescript.js";
import { reverseMap } from "../utils.js";
import { okLog } from "../../log.js";
import type { DetectedModules } from "../../detectModules.js";

type BuildTypesTaskOption = {
  entrypoints: Map<string, string>;
  sourceDir: string;
  outDir: string;
  modules: DetectedModules;
};

export async function buildTypesTask({
  entrypoints,
  sourceDir,
  outDir,
  modules,
}: BuildTypesTaskOption) {
  const reversedEntrypoints = reverseMap(entrypoints);
  const tsEntrypoints = [...entrypoints.values()].filter((entry) =>
    entry.endsWith(".ts"),
  );
  if (tsEntrypoints.length === 0 || modules.ts == null) {
    return new Map<string, string>();
  }

  const dtsMap = await callTypescript({
    ts: modules.ts,
    sourceDir,
    files: tsEntrypoints,
    outDir,
  });

  const result = new Map<string, string>();
  for (const [types, source] of dtsMap) {
    const exportPath = reversedEntrypoints.get(source);
    if (!exportPath) {
      continue;
    }
    for (const path of exportPath) {
      result.set(types, path);
    }
  }

  okLog(".d.ts");

  return result;
}
