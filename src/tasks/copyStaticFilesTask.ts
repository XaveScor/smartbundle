import { join } from "node:path";
import { copyFile, readdir } from "node:fs/promises";
import { okLog } from "../log.js";

export async function copyStaticFilesTask(sourceDir: string, outDir: string) {
  const files = await copyStaticFiles({
    relativeFiles: new Set(["readme.md", "license", "license.txt"]),
    sourceDir,
    outDir,
  });

  okLog("Static files:", [...files].join(", "));

  return files;
}

type CopyStaticFilesOptions = {
  relativeFiles: Set<string>;
  sourceDir: string;
  outDir: string;
};

async function copyStaticFiles({
  sourceDir,
  outDir,
  relativeFiles,
}: CopyStaticFilesOptions) {
  const dirFiles = new Map(
    (await readdir(sourceDir, { recursive: true })).map(
      (f) => [f.toLowerCase(), f] as const,
    ),
  );

  const res = new Set<string>();
  for (const file of relativeFiles) {
    try {
      const matchingFile = dirFiles.get(file.toLowerCase());

      if (matchingFile) {
        const outFilePath = join(outDir, matchingFile);
        const filePath = join(sourceDir, matchingFile);
        await copyFile(filePath, outFilePath);
        res.add(matchingFile);
      }
    } catch {}
  }

  return res;
}
