import { join, isAbsolute, relative } from "node:path";
import { parsePackageJson } from "./packageJson.js";
import { build } from "vite";
import { writePackageJson } from "./writePackageJson.js";
import rollupts from "@rollup/plugin-typescript";

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

export async function run(args: Args) {
  const sourceDir = myResolve(process.cwd(), args.sourceDir ?? ".");
  const packagePath = myResolve(
    sourceDir,
    args.packagePath ?? "./package.json",
  );
  const outDir = myResolve(process.cwd(), args.outputDir ?? "./dist");

  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    return { error: true, errors: packageJson };
  }

  const mainEntry = join(sourceDir, packageJson.exports);
  const splittedEntry = mainEntry.split(".");
  const entryExt = splittedEntry.pop();
  const entryPrefix = splittedEntry.join(".");
  const typescript =
    entryExt === "ts"
      ? rollupts({
          compilerOptions: {
            declaration: true,
            declarationDir: outDir,
            rootDir: sourceDir,
          },
        })
      : false;
  await build({
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
        entry: {
          mainEntry,
        },
        formats: ["es"],
        fileName: (format, entryName) => `${entryName}.mjs`,
      },
      rollupOptions: {
        plugins: [typescript],
        output: {
          preserveModules: true,
        },
      },
    },
  });
  const filePath = "./bundle.mjs";
  await writePackageJson(outDir, packageJson, {
    entryPointPath: filePath,
    typesPath: typescript
      ? "./" + relative(sourceDir, `${entryPrefix}.d.ts`)
      : false,
  });

  return { error: false };
}
