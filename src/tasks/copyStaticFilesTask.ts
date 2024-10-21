import { join } from "node:path";
import { copyFile, readdir } from "node:fs/promises";

export async function copyStaticFilesTask(sourceDir: string, outDir: string) {
  return copyStaticFiles({
    relativeFiles: new Set(["readme.md"]),
    sourceDir,
    outDir,
  });
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

  for (const file of relativeFiles) {
    try {
      const matchingFile = dirFiles.get(file.toLowerCase());

      if (matchingFile) {
        const outFilePath = join(outDir, matchingFile);
        const filePath = join(sourceDir, matchingFile);
        await copyFile(filePath, outFilePath);
      }
    } catch {}
  }
}
