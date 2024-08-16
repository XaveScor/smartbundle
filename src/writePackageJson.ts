import { writeFile } from "node:fs/promises";
import { PackageJson } from "./packageJson.js";

export type ExportsObject = {
  mjs?: string;
  mdts?: string;
  cjs?: string;
  cdts?: string;
};

type BuildResult = {
  exportsMap: Map<string, ExportsObject>;
};

function buildTypesPath(mainEntrypoint: string) {
  return mainEntrypoint.replace(/\..*$/, ".d.ts");
}

type ExportsPackageJsonObj = {
  import?: ExportsPackageJsonObj | string;
  require?: ExportsPackageJsonObj | string;
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
    if (key === "__bin__") {
      continue;
    }
    const anExport: ExportsPackageJsonObj = {};

    if (value.mjs || value.mdts) {
      anExport.import = {
        types: value.mdts,
        default: value.mjs,
      };
    }
    if (value.cjs || value.cdts) {
      anExport.require = {
        types: value.cdts,
        default: value.cjs,
      };
    }

    // because we need to have default and types key on the end
    // JSON.stringify will put it on the end if we put value at the last step
    anExport.types = value.mdts;
    anExport.default = value.mjs;

    allExports[key] = anExport;
  }

  const res = {
    name: parsed.name,
    type: "module",
    version: parsed.version,
    bin: exportsMap.get("__bin__")?.mjs,
    types: allExports["."]?.types,
    module: allExports["."]?.default,
    description: parsed.description ?? "",
    exports: allExports,
    dependencies: parsed.dependencies ?? undefined,
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
