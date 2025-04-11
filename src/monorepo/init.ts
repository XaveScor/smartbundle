import { writePackageJson } from "../writePackageJson.js";
import type { Dirs } from "../resolveDirs.js";
import type { PackageJson } from "../packageJson.js";
import * as fs from "node:fs/promises";
import { markDirAsMonorepo, monorepoMarkFileName } from "./isMonorepo.js";

const gitignoreContent = `# Ignore all files
*
# Unignore the following files
!.gitignore
!package.json
!${monorepoMarkFileName}
`;

export async function initMonorepo(dirs: Dirs, packageJson: PackageJson) {
  const { outDir } = dirs;
  await writePackageJson(
    outDir,
    /**
     * We need to remove all scripts from the package.json because it can contain some scripts like
     * build: smartbundle
     * prebuild: smartbundle-init-monorepo
     *
     * It allows the user to run own scripts without any conflicts
     */
    { ...packageJson, scripts: {} },
    {
      binsMap: new Map(),
      exportsMap: new Map(),
    },
  );
  await fs.writeFile(`${outDir}/.gitignore`, gitignoreContent);
  await markDirAsMonorepo(outDir);
}
