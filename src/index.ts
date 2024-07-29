import { join, isAbsolute } from "node:path";
import { parsePackageJson } from "./packageJson.js";
import { build } from "vite";
import { writePackageJson } from "./writePackageJson.js";

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
  await build({
    publicDir: false,
    build: {
      outDir,
      write: true,
      minify: true,
      emptyOutDir: true,
      lib: {
        entry: {
          mainEntry,
        },
        formats: ["es"],
        fileName: () => "bundle.mjs",
      },
    },
  });
  const filePath = "./bundle.mjs";
  await writePackageJson(outDir, packageJson, { entryPointPath: filePath });

  return { error: false };
}
