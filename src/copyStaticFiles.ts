import { join } from "node:path";
import { copyFile, readdir } from "node:fs/promises";

type CopyStaticFilesOptions = {
  relativeFiles: Set<string>;
  sourceDir: string;
  outDir: string;
};

export async function copyStaticFiles({
  sourceDir,
  outDir,
  relativeFiles,
}: CopyStaticFilesOptions): Promise<string[]> {
  const copiedFiles = new Array<string>();

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
        copiedFiles.push(matchingFile);
      }
    } catch {}
  }

  return copiedFiles;
}
