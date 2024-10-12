import { writeFile } from "node:fs/promises";
import { PackageJson } from "./packageJson.js";

export type ExportsObject = {
  mjs?: string;
  dts?: string;
  cjs?: string;
  raw?: string;
};

type BuildResult = {
  exportsMap: Map<string, ExportsObject>;
};

type ExportsPackageJsonObj =
  | {
      import?: ExportsPackageJsonObj;
      require?: ExportsPackageJsonObj;
      types?: string;
      default?: string;
    }
  | string;

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

    if (value.dts) {
      anExport.types = value.dts;
    }
    if (value.mjs) {
      anExport.import = {};
      if (value.dts) {
        anExport.import.types = value.dts;
      }
      anExport.import.default = value.mjs;
    }
    if (value.cjs) {
      anExport.require = {};
      if (value.dts) {
        anExport.require.types = value.dts;
      }
      anExport.require.default = value.cjs;
    }

    // because we need to have default and types key on the end
    // JSON.stringify will put it on the end if we put value at the last step
    anExport.default = value.mjs;

    allExports[key] = anExport;
  }
  allExports["./package.json"] = "./package.json";

  const rootExport =
    typeof allExports["."] === "object" ? allExports["."] : undefined;
  const res = {
    name: parsed.name,
    type: "module",
    version: parsed.version,
    bin: exportsMap.get("__bin__")?.mjs,
    types: rootExport?.types,
    module: rootExport?.default,
    description: parsed.description ?? "",
    exports: allExports,
    dependencies: parsed.dependencies ?? undefined,
    optionalDependencies: parsed.optionalDependencies ?? undefined,
    repository: parsed.repository,
    keywords: parsed.keywords,
    author: parsed.author,
    contributors: parsed.contributors,
    license: parsed.license,
    peerDependencies: parsed.peerDependencies,
    engines: parsed.engines,
    browser: parsed.browser,
    funding: parsed.funding,
    os: parsed.os,
    cpu: parsed.cpu,
    maintainers: parsed.maintainers,
    bugs: parsed.bugs,
    sideEffects: parsed.sideEffects,
    unpkg: parsed.unpkg,
    homepage: parsed.homepage,
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
