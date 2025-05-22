import { args } from "../args.js";
import { resolveDirs } from "../resolveDirs.js";
import { mkdir, rm } from "node:fs/promises";
import { initMonorepo } from "./init.js";
import { parsePackageJson } from "../packageJson.js";

(async () => {
  const dirs = resolveDirs(args);
  const { outDir, sourceDir, packagePath } = dirs;

  const packageJson = await parsePackageJson({ sourceDir, packagePath });
  if (Array.isArray(packageJson)) {
    console.error(packageJson);
    throw new Error("Failed to parse package.json");
  }
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  await initMonorepo(dirs, packageJson);
})();
