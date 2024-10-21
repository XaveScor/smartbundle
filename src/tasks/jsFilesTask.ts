import { type Rollup } from "vite";
import { reverseMap } from "./utils.js";

type JsFilesTaskOption = {
  buildOutput: Rollup.OutputChunk[];
  entrypoints: Map<string, string>;
};

export async function jsFilesTask({
  buildOutput,
  entrypoints,
}: JsFilesTaskOption) {
  const reversedEntrypoints = reverseMap(entrypoints);
  const res = new Map<string, string>();
  for (const el of buildOutput) {
    if (el.facadeModuleId == null) {
      continue;
    }
    const exportPath = reversedEntrypoints.get(el.facadeModuleId);
    if (!exportPath) {
      continue;
    }
    for (const path of exportPath) {
      res.set(el.fileName, path);
    }
  }

  return res;
}
