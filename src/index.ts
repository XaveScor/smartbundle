import { relative } from "node:path";
import { mkdir, rm } from "node:fs/promises";
import { parsePackageJson } from "./packageJson.js";
import { type ExportsObject, writePackageJson } from "./writePackageJson.js";
import { buildVite } from "./buildVite.js";
import { type Args, resolveDirs } from "./resolveDirs.js";
import { createViteConfig } from "./createViteConfig.js";
import { copyStaticFilesTask } from "./tasks/copyStaticFilesTask.js";
import { buildTypesTask } from "./tasks/buildTypesTask/buildTypesTask.js";
import { BuildError } from "./error.js";
import { jsFilesTask } from "./tasks/jsFilesTask.js";
import { binsTask } from "./tasks/binsTask.js";

function setExports(
  exportsMap: Map<string, ExportsObject>,
  exportName: string,
  mapFn: (entry: ExportsObject) => ExportsObject,
) {
  const entry = exportsMap.get(exportName) ?? ({} as ExportsObject);
  exportsMap.set(exportName, mapFn(entry));
}

export async function defineViteConfig(args: Args = {}) {
  const dirs = resolveDirs(args);
  const { sourceDir, outDir, packagePath, outInternalsDir } = dirs;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await mkdir(outInternalsDir, { recursive: true });
  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    console.error(packageJson);
    throw new Error("Failed to parse package.json");
  }

  const { viteConfig } = createViteConfig({ dirs, packageJson });

  return viteConfig;
}

export async function run(args: Args) {
  const dirs = resolveDirs(args);
  const { sourceDir, outDir, packagePath, outInternalsDir } = dirs;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    console.log(packageJson);
    return { error: true, errors: packageJson };
  }

  const { viteConfig, entrypoints, bins } = createViteConfig({
    dirs,
    packageJson,
  });

  const outputs = await buildVite({ viteConfig });
  if (outputs.error) {
    return { error: true, errors: outputs.errors };
  }
  await mkdir(outInternalsDir, { recursive: true });
  const viteOutput = outputs.output;

  const exportsMap = new Map<string, ExportsObject>();
  const binsMap = new Map<string, string>();
  const tasksRes = await Promise.allSettled([
    copyStaticFilesTask(sourceDir, outDir),
    buildTypesTask({
      sourceDir,
      outDir,
      entrypoints,
      buildOutput: viteOutput,
    }).then((res) => {
      for (const [value, key] of res) {
        setExports(exportsMap, key, (entry) => {
          entry.dts = "./" + relative(outDir, value);
          return entry;
        });
      }
    }),
    jsFilesTask({ buildOutput: viteOutput, entrypoints }).then((res) => {
      for (const [value, key] of res) {
        setExports(exportsMap, key, (entry) => {
          const format = value.endsWith(".cjs") ? "cjs" : "es";
          if (format === "es") {
            entry.mjs = "./" + value;
          } else if (format === "cjs") {
            entry.cjs = "./" + value;
          }
          return entry;
        });
      }
    }),
    binsTask({ outInternalsDir, bins, buildOutput: viteOutput, outDir }).then(
      (res) => {
        for (const [value, key] of res) {
          binsMap.set(key, value);
        }
      },
    ),
  ]);

  const errors = tasksRes
    .filter((res) => res.status === "rejected")
    .map((res) => res.reason)
    .filter((res): res is BuildError => res instanceof BuildError)
    .map((res) => res.error);

  if (errors.length > 0) {
    return { error: true, errors };
  }

  await writePackageJson(outDir, packageJson, {
    exportsMap,
    binsMap,
  });

  return { error: false };
}
