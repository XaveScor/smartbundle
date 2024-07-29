import { writeFile } from "node:fs/promises";
import { PackageJson } from "./packageJson.js";

type BuildResult = {
  entryPointPath: string;
};

export async function writePackageJson(
  outDir: string,
  parsed: PackageJson,
  buildResult: BuildResult,
) {
  const res = {
    name: parsed.name,
    exports: {
      ".": {
        default: buildResult.entryPointPath,
      },
    },
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
