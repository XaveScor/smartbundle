import { writeFile } from "node:fs/promises";
import { PackageJson } from "./packageJson.js";

export type ExportsObject = {
  mjs?: string;
  mdts?: string;
};

type BuildResult = {
  exportsMap: Map<string, ExportsObject>;
};

function buildTypesPath(mainEntrypoint: string) {
  return mainEntrypoint.replace(/\..*$/, ".d.ts");
}

type ExportsPackageJsonObj = {
  import?: ExportsPackageJsonObj | string;
  types?: string;
  default?: string;
};

export async function writePackageJson(
  outDir: string,
  parsed: PackageJson,
  { exportsMap }: BuildResult,
) {
  // we always want to have `exports` property in the target package.json
  // If you want to export something, please, specify them
  const allExports: Record<string, ExportsPackageJsonObj> = {};
  for (const [key, value] of exportsMap) {
    const anExport: ExportsPackageJsonObj = {
      types: value.mdts,
    };

    if (value.mjs || value.mdts) {
      anExport.import = {
        types: value.mdts,
        default: value.mjs,
      };
    }

    // because we need to have default key on the end
    // JSON.stringify will put it on the end if we put value at the last step
    anExport.default = value.mjs;

    allExports[key] = anExport;
  }

  const res = {
    name: parsed.name,
    type: "module",
    version: parsed.version,
    types: allExports["."]?.types,
    module: allExports["."]?.default,
    description: parsed.description ?? "",
    exports: allExports,
    dependencies: parsed.dependencies ?? undefined,
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
