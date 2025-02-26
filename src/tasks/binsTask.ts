import { mkdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import type { Rollup } from "vite";
import { reverseMap } from "./utils.js";
import { okLog } from "../log.js";

type BinsTaskOption = {
  buildOutput: Rollup.OutputChunk[];
  bins: Map<string, string>;
  outBinsDir: string;
  outDir: string;
};

export async function binsTask({
  buildOutput,
  bins,
  outBinsDir,
  outDir,
}: BinsTaskOption) {
  if (bins.size === 0) {
    return new Map<string, string>();
  }
  await mkdir(outBinsDir, { recursive: true });
  const reversedEntrypoints = reverseMap(bins);
  const res = new Map<string, string>();
  for (const el of buildOutput) {
    if (el.facadeModuleId == null) {
      continue;
    }
    if (el.fileName.endsWith(".js")) {
      continue;
    }
    const binsNames = reversedEntrypoints.get(el.facadeModuleId);
    if (!binsNames) {
      continue;
    }
    for (const binName of binsNames) {
      const totalPath = relative(outBinsDir, join(outDir, el.fileName));
      const execPath = join(outBinsDir, `${binName}.js`);
      await writeFile(
        execPath,
        `#!/usr/bin/env node
import("${totalPath}");
`,
      );
      res.set(relative(outDir, execPath), binName);
    }
  }

  if (res.size) {
    okLog("Bin:", [...res.values()].join(", "));
  }

  return res;
}
