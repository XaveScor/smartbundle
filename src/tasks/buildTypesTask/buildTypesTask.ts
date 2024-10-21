import { type Rollup } from "vite";
import { errors } from "../../errors.js";
import { callTypescript } from "./callTypescript.js";
import { reverseMap } from "../utils.js";

type BuildTypesTaskOption = {
  buildOutput: Rollup.OutputChunk[];
  entrypoints: Map<string, string>;
  sourceDir: string;
  outDir: string;
};

export async function buildTypesTask({
  buildOutput,
  entrypoints,
  sourceDir,
  outDir,
}: BuildTypesTaskOption) {
  const reversedEntrypoints = reverseMap(entrypoints);
  const tsEntrypoints = [...entrypoints.values()].filter((entry) =>
    entry.endsWith(".ts"),
  );
  if (tsEntrypoints.length === 0) {
    return new Map<string, string>();
  }

  let ts: typeof import("typescript");
  try {
    ts = await import("typescript");
  } catch {
    throw errors.typescriptNotFound;
  }

  const files = buildOutput.map((el) => el.facadeModuleId ?? "");
  const dtsMap = await callTypescript({ ts, sourceDir, files, outDir });

  const result = new Map<string, string>();
  for (const [source, dts] of dtsMap) {
    const exportPath = reversedEntrypoints.get(source);
    if (!exportPath) {
      continue;
    }
    for (const path of exportPath) {
      result.set(dts, path);
    }
  }

  return result;
}
