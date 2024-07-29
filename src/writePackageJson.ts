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
    exports: {
      ".": {
        default: buildResult.entryPointPath,
        ...(buildResult.typesPath ? { types: buildResult.typesPath } : {}),
      },
    },
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
