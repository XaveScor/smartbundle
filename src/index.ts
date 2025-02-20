import { relative } from "node:path";
import { mkdir, rm } from "node:fs/promises";
import { parsePackageJson } from "./packageJson.js";
import { type ExportsObject, writePackageJson } from "./writePackageJson.js";
import { resolveDirs } from "./resolveDirs.js";
import { createViteConfig } from "./createViteConfig.js";
import { copyStaticFilesTask } from "./tasks/copyStaticFilesTask.js";
import { buildTypesTask } from "./tasks/buildTypesTask/buildTypesTask.js";
import { BuildError } from "./error.js";
import { jsFilesTask } from "./tasks/jsFilesTask.js";
import { binsTask } from "./tasks/binsTask.js";
import { detectModules } from "./detectModules.js";
import { disableLog, lineLog, log, okLog } from "./log.js";
import { runSettled } from "./pipeline.js";
import { type Args } from "./args.js";
import { viteTask } from "./tasks/viteTask.js";
import { promiseSettledResultErrors } from "./promiseSettledResultErrors.js";
import { PrettyError } from "./PrettyErrors.js";

function setExports(
  exportsMap: Map<string, ExportsObject>,
  exportName: string,
  mapFn: (entry: ExportsObject) => ExportsObject,
) {
  const entry = exportsMap.get(exportName) ?? ({} as ExportsObject);
  exportsMap.set(exportName, mapFn(entry));
}

export async function defineViteConfig(args: Partial<Args> = {}) {
  const completeArgs: Args = {
    sourceDir: args.sourceDir ?? process.cwd(),
    packagePath: args.packagePath ?? `${args.sourceDir ?? process.cwd()}/package.json`,
    outputDir: args.outputDir ?? `${process.cwd()}/dist`,
    command: args.command ?? "build",
    verbose: args.verbose,
    seq: args.seq,
    publishFlags: args.publishFlags,
  };
  disableLog();
  const dirs = resolveDirs(completeArgs);
  const { sourceDir, outDir, packagePath } = dirs;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    console.error(packageJson);
    throw new Error("Failed to parse package.json");
  }

  const modulesResult = await detectModules(packageJson, dirs);
  if (modulesResult.error) {
    return { error: true, errors: modulesResult.errors };
  }
  const { modules } = modulesResult;
  const { viteConfig } = createViteConfig({
    dirs,
    packageJson,
    modules,
    test: true,
  });

  return viteConfig;
}

type RunResult =
  | {
      error: false;
      errors: [];
    }
  | {
      error: true;
      errors: Array<string | PrettyError>;
    };

export async function run(args: Partial<Args>): Promise<RunResult> {
  const completeArgs: Args = {
    sourceDir: args.sourceDir ?? process.cwd(),
    packagePath: args.packagePath ?? `${args.sourceDir ?? process.cwd()}/package.json`,
    outputDir: args.outputDir ?? `${process.cwd()}/dist`,
    command: args.command ?? "build",
    verbose: args.verbose,
    seq: args.seq,
    publishFlags: args.publishFlags,
  };
  const dirs = resolveDirs(completeArgs);
  const { sourceDir, outDir, packagePath, outBinsDir } = dirs;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    return { error: true, errors: packageJson };
  }

  const modulesResult = await detectModules(packageJson, dirs);
  if (modulesResult.error) {
    return { error: true, errors: modulesResult.errors };
  }
  const { modules } = modulesResult;
  const { viteConfig, entrypoints, bins } = createViteConfig({
    dirs,
    packageJson,
    modules,
  });

  const exportsMap = new Map<string, ExportsObject>();
  const binsMap = new Map<string, string>();

  const tasksRes = await runSettled(completeArgs, [
    copyStaticFilesTask(sourceDir, outDir),
    buildTypesTask({
      dirs,
      packageJson,
      entrypoints,
      modules,
    }).then(({ entrypointToEsDtsMap, entrypointToCjsDtsMap }) => {
      for (const [entrypoint, dts] of entrypointToEsDtsMap) {
        setExports(exportsMap, entrypoint, (entry) => {
          entry.dmts = "./" + relative(outDir, dts);
          return entry;
        });
      }

      for (const [entrypoint, dts] of entrypointToCjsDtsMap) {
        setExports(exportsMap, entrypoint, (entry) => {
          entry.dcts = "./" + relative(outDir, dts);
          return entry;
        });
      }
    }),
    viteTask({ viteConfig }).then((viteOutput) =>
      runSettled(completeArgs, [
        jsFilesTask({ buildOutput: viteOutput, entrypoints, outDir }).then(
          (res) => {
            for (const [filePath, name] of res) {
              setExports(exportsMap, name, (entry) => {
                const format = filePath.endsWith(".js") ? "cjs" : "es";
                if (format === "es") {
                  entry.mjs = "./" + filePath;
                } else if (format === "cjs") {
                  entry.cjs = "./" + filePath;
                }
                return entry;
              });
            }
          },
        ),
        binsTask({ outBinsDir, bins, buildOutput: viteOutput, outDir }).then(
          (res) => {
            for (const [value, key] of res) {
              binsMap.set(key, value);
            }
          },
        ),
      ]),
    ),
  ]);

  const errors = promiseSettledResultErrors(tasksRes).map((res) => {
    if (res instanceof PrettyError) {
      return res;
    }

    if (res instanceof BuildError) {
      return res.error;
    }

    return res.message;
  });

  if (errors.length > 0) {
    return { error: true, errors };
  }

  await writePackageJson(outDir, packageJson, {
    exportsMap,
    binsMap,
  });

  lineLog();
  log(`Build finished: ./${relative(sourceDir, outDir)}`);
  return { error: false, errors: [] };
}
