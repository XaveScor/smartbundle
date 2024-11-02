import { writeFile } from "node:fs/promises";
import { type PackageJson } from "./packageJson.js";

export type ExportsObject = {
  mjs?: string;
  dts?: string;
  cdts?: string;
  cjs?: string;
  raw?: string;
};

type BuildResult = {
  exportsMap: Map<string, ExportsObject>;
  binsMap: Map<string, string>;
};

type ExportsPackageJsonObj =
  | {
      import?: ExportsPackageJsonObj;
      require?: ExportsPackageJsonObj;
      types?: string;
      default?: string;
    }
  | string;

function extractValue(value?: ExportsPackageJsonObj) {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  return value.default;
}

export async function writePackageJson(
  outDir: string,
  parsed: PackageJson,
  { exportsMap, binsMap }: BuildResult,
) {
  // we always want to have `exports` property in the target package.json
  // If you want to export something, please, specify them
  const allExports: Record<string, ExportsPackageJsonObj> = {};
  for (const [key, value] of exportsMap) {
    const anExport: ExportsPackageJsonObj = {};

    if (value.mjs) {
      anExport.import = {};
      if (value.dts) {
        anExport.import.types = value.dts;
      }
      anExport.import.default = value.mjs;
    }
    if (value.cjs) {
      anExport.require = {};
      if (value.cdts) {
        anExport.require.types = value.cdts;
      }
      anExport.require.default = value.cjs;
    }

    // should be first for correct resolving
    anExport.types = value.cdts ?? value.dts;
    // because we need to have default and types key on the end
    // JSON.stringify will put it on the end if we put value at the last step
    anExport.default = value.cjs;

    allExports[key] = anExport;
  }
  allExports["./package.json"] = "./package.json";

  const bin = binsMap.size > 0 ? Object.fromEntries(binsMap) : undefined;

  const rootExport =
    typeof allExports["."] === "object" ? allExports["."] : undefined;
  const res = {
    name: parsed.name,
    type: "commonjs",
    version: parsed.version,
    bin,
    types: rootExport?.types,
    module: extractValue(rootExport?.import),
    main: extractValue(rootExport?.require),
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
    devDependencies: parsed.devDependencies,
  };

  await writeFile(`${outDir}/package.json`, JSON.stringify(res, null, 2));
}
