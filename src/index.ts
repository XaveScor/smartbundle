import { relative } from "node:path";
import { mkdir, rm } from "node:fs/promises";
import { parsePackageJson } from "./packageJson.js";
import { ExportsObject, writePackageJson } from "./writePackageJson.js";
import { errors } from "./errors.js";
import { buildTypes } from "./buildTypes.js";
import { buildVite } from "./buildVite.js";
import { copyStaticFiles } from "./copyStaticFiles.js";
import { type Args, resolveDirs } from "./resolveDirs.js";
import { createViteConfig } from "./createViteConfig.js";

function reverseMap(map: Map<string, string>): Map<string, Array<string>> {
  const reversed = new Map<string, Array<string>>();
  for (const [key, value] of map) {
    const arr = reversed.get(value) ?? [];
    arr.push(key);
    reversed.set(value, arr);
  }
  return reversed;
}

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
  const { sourceDir, outDir, packagePath } = dirs;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
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
  const { sourceDir, outDir, packagePath } = dirs;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    console.log(packageJson);
    return { error: true, errors: packageJson };
  }

  const { viteConfig, entrypoints } = createViteConfig({ dirs, packageJson });

  const outputs = await buildVite({ viteConfig });
  if (outputs.error) {
    return { error: true, errors: outputs.errors };
  }
  const viteOutput = outputs.output;

  const exportsMap = new Map<string, ExportsObject>();
  const reversedEntrypoints = reverseMap(entrypoints);
  const tsEntrypoints = [...entrypoints.values()].filter((entry) =>
    entry.endsWith(".ts"),
  );
  if (tsEntrypoints.length > 0) {
    try {
      await import("typescript");
    } catch {
      return { error: true, errors: [errors.typescriptNotFound] };
    }
    const files = viteOutput.map((el) => el.facadeModuleId ?? "");
    const dtsMap = await buildTypes({ sourceDir, files, outDir });

    for (const [source, dts] of dtsMap) {
      const exportPath = reversedEntrypoints.get(source);
      if (!exportPath) {
        continue;
      }
      for (const path of exportPath) {
        setExports(exportsMap, path, (entry) => {
          entry.dts = "./" + relative(outDir, dts);
          return entry;
        });
      }
    }
  }

  for (const el of viteOutput) {
    if (el.facadeModuleId == null) {
      continue;
    }
    const exportPath = reversedEntrypoints.get(el.facadeModuleId);
    if (!exportPath) {
      continue;
    }
    for (const path of exportPath) {
      setExports(exportsMap, path, (entry) => {
        const format = el.fileName.endsWith(".cjs") ? "cjs" : "es";
        if (format === "es") {
          entry.mjs = "./" + el.fileName;
        } else if (format === "cjs") {
          entry.cjs = "./" + el.fileName;
        }
        return entry;
      });
    }
  }
  await copyStaticFiles({
    relativeFiles: new Set(["readme.md"]),
    sourceDir,
    outDir,
  });
  await writePackageJson(outDir, packageJson, {
    exportsMap,
  });

  return { error: false };
}
