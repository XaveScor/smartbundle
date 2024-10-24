import { writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { type Rollup } from "vite";
import { reverseMap } from "./utils.js";

type BinsTaskOption = {
  buildOutput: Rollup.OutputChunk[];
  bins: Map<string, string>;
  outInternalsDir: string;
  outDir: string;
};

export async function binsTask({
  buildOutput,
  bins,
  outInternalsDir,
  outDir,
}: BinsTaskOption) {
  const reversedEntrypoints = reverseMap(bins);
  const res = new Map<string, string>();
  for (const el of buildOutput) {
    if (el.facadeModuleId == null) {
      continue;
    }
    if (el.fileName.endsWith(".cjs")) {
      continue;
    }
    const binsPath = reversedEntrypoints.get(el.facadeModuleId);
    if (!binsPath) {
      continue;
    }
    for (const path of binsPath) {
      const totalPath = relative(outInternalsDir, join(outDir, el.fileName));
      const execPath = join(outInternalsDir, path);
      await writeFile(
        execPath,
        `#!/usr/bin/env node
import("${totalPath}");
`,
      );
      res.set(relative(outDir, execPath), path);
    }
  }

  return res;
}
