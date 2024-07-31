import { writeFile } from "node:fs/promises";
import { PackageJson } from "./packageJson.js";

type BuildResult = {
  entryPointPath: string;
  typesPath: string | false;
};

export async function writePackageJson(
  outDir: string,
  parsed: PackageJson,
  buildResult: BuildResult,
) {
  const res = {
    name: parsed.name,
    type: "module",
    version: parsed.version,
    exports: {
      ".": {
        ...(buildResult.typesPath ? { types: buildResult.typesPath } : {}),
        default: buildResult.entryPointPath,
      },
    },
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
