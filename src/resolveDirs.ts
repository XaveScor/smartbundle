import { isAbsolute, join } from "node:path";

export type Args = {
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

export function resolveDirs(args: Args) {
  const sourceDir = myResolve(process.cwd(), args.sourceDir ?? ".");
  const packagePath = myResolve(
    sourceDir,
    args.packagePath ?? "./package.json",
  );
  const outDir = myResolve(process.cwd(), args.outputDir ?? "./dist");

  return { sourceDir, packagePath, outDir };
}

export type Dirs = ReturnType<typeof resolveDirs>;
