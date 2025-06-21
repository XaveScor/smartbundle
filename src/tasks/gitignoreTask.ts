import fs from "node:fs/promises";
import path from "node:path";
import type { Dirs } from "../resolveDirs.js";

type GitignoreTaskArg = {
  dirs: Dirs;
};

export async function gitignoreTask({ dirs }: GitignoreTaskArg) {
  const { outDir } = dirs;

  // Ignore the all files to prevent commiting the dist
  const gitignoreContent = "*\n";

  const gitignorePath = path.join(outDir, ".gitignore");
  await fs.writeFile(gitignorePath, gitignoreContent);
}
