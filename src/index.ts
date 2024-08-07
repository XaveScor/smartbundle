import { join, isAbsolute, relative, resolve } from "node:path";
import { mkdir, rm } from "node:fs/promises";
import { parsePackageJson } from "./packageJson.js";
import { build } from "vite";
import { ExportsObject, writePackageJson } from "./writePackageJson.js";
import rollupts from "@rollup/plugin-typescript";
import { errors } from "./errors.js";

type Args = {
  sourceDir?: string;
  packagePath?: string;
  outputDir?: string;
};

function myResolve(path1: string, path2: string) {
  if (isAbsolute(path2)) {
    return path2;
  }

  return join(path1, path2);
}

function mapToObject(map: Map<string, string>) {
  const obj: Record<string, string> = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

function reverseMap(map: Map<string, string>): Map<string, Array<string>> {
  const reversed = new Map<string, Array<string>>();
  for (const [key, value] of map) {
    const noExtValue = value.replace(/\.[^.]+$/, "");
    const arr = reversed.get(noExtValue) ?? [];
    arr.push(key);
    reversed.set(noExtValue, arr);
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

export async function run(args: Args) {
  const sourceDir = myResolve(process.cwd(), args.sourceDir ?? ".");
  const packagePath = myResolve(
    sourceDir,
    args.packagePath ?? "./package.json",
  );
  const outDir = myResolve(process.cwd(), args.outputDir ?? "./dist");
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    console.log(packageJson);
    return { error: true, errors: packageJson };
  }

  const entrypoints = new Map<string, string>();
  if (packageJson.exports) {
    const mainEntry = join(sourceDir, packageJson.exports);
    entrypoints.set(".", mainEntry);
  }

  if (packageJson.bin) {
    const binEntry = join(sourceDir, packageJson.bin);
    entrypoints.set("__bin__", binEntry);
  }

  const hasTs = [...entrypoints.values()].some((entry) =>
    entry.endsWith(".ts"),
  );
  const typescript = hasTs
    ? // @ts-expect-error
      rollupts({
        compilerOptions: {
          declaration: true,
          declarationDir: outDir,
        },
      })
    : false;
  const outputs = await build({
    publicDir: false,
    build: {
      outDir,
      write: true,
      minify: false,
      emptyOutDir: true,
      assetsInlineLimit: 0,
      terserOptions: {
        compress: false,
        mangle: false,
      },
      lib: {
        entry: mapToObject(entrypoints),
        formats: ["es"],
        fileName: (format, entryName) => {
          const entrypoint = entrypoints.get(entryName);
          if (!entrypoint) {
            const noExt = entryName.replace(/\.[^.]+$/, "");
            return "__do_not_import_directly__/" + noExt + ".mjs";
          }
          const relativePath = relative(sourceDir, entrypoint);
          const noExt = relativePath.replace(/\.[^.]+$/, "");
          if (format === "es") {
            return `${noExt}.mjs`;
          }
          return noExt;
        },
      },
      rollupOptions: {
        plugins: [typescript],
        external: (id, parentId, isResolved) => {
          if (id === packageJson.name) {
            return true;
          }
          if (id.startsWith("node:")) {
            return true;
          }
          if (packageJson.dependencies) {
            return id in packageJson.dependencies;
          }
          return false;
        },
        output: {
          preserveModules: true,
        },
      },
    },
  });
  if (!Array.isArray(outputs)) {
    return { error: true, errors: [errors.rollupError] };
  }
  const exportsMap = new Map<string, ExportsObject>();
  const reversedEntrypoints = reverseMap(entrypoints);
  for (const { output } of outputs) {
    for (const el of output) {
      switch (el.type) {
        case "chunk":
          const noExtPath = el.facadeModuleId?.replace(/\.[^.]+$/, "");
          if (noExtPath == null) {
            continue;
          }
          const exportPath = reversedEntrypoints.get(noExtPath);
          if (!exportPath) {
            continue;
          }
          for (const path of exportPath) {
            setExports(exportsMap, path, (entry) => {
              entry.mjs = el.fileName;
              return entry;
            });
          }
          break;
        case "asset":
          if (el.fileName.endsWith(".d.ts")) {
            const noExtPath = join(
              sourceDir,
              el.fileName.replace(/\.d\.ts$/, ""),
            );
            const exportPath = reversedEntrypoints.get(noExtPath);
            if (!exportPath) {
              continue;
            }
            for (const path of exportPath) {
              setExports(exportsMap, path, (entry) => {
                entry.mdts = el.fileName;
                return entry;
              });
            }
          }
          break;
      }
    }
  }

  await writePackageJson(outDir, packageJson, {
    exportsMap,
  });

  return { error: false };
}
