import { callTypescript } from "./callTypescript.js";
import { reverseMap } from "../utils.js";
import { okLog } from "../../log.js";
import type { DetectedModules } from "../../detectModules.js";
import { type PackageJson } from "../../packageJson.js";
import { type Dirs } from "../../resolveDirs.js";

type BuildTypesTaskOption = {
  entrypoints: Map<string, string>;
  dirs: Dirs;
  modules: DetectedModules;
  packageJson: PackageJson;
};

export async function buildTypesTask({
  entrypoints,
  dirs,
  packageJson,
  modules,
}: BuildTypesTaskOption) {
  const { outDir } = dirs;
  const tsEntrypoints = [...entrypoints.values()].filter((entry) =>
    entry.endsWith(".ts"),
  );
  const reversedEntrypoints = reverseMap(entrypoints);

  const entrypointToEsDtsMap = new Map<string, string>();
  const entrypointToCjsDtsMap = new Map<string, string>();
  if (tsEntrypoints.length === 0 || modules.ts == null) {
    return { entrypointToEsDtsMap, entrypointToCjsDtsMap };
  }

  const dtsMap = await callTypescript({
    ts: modules.ts,
    dirs,
    packageJson,
    tsEntrypoints,
    outDir,
  });

  for (const [source, dts] of dtsMap.sourceToEsmDtsMap) {
    const entrypoints = reversedEntrypoints.get(source);
    if (entrypoints) {
      for (const entrypoint of entrypoints) {
        entrypointToEsDtsMap.set(entrypoint, dts);
      }
    }
  }

  for (const [source, dts] of dtsMap.sourceToCjsDtsMap) {
    const entrypoints = reversedEntrypoints.get(source);
    if (entrypoints) {
      for (const entrypoint of entrypoints) {
        entrypointToCjsDtsMap.set(entrypoint, dts);
      }
    }
  }

  okLog(".d.ts");

  return { entrypointToEsDtsMap, entrypointToCjsDtsMap };
}
