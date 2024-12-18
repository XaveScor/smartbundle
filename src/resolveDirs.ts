import { isAbsolute, join } from "node:path";
import { type Args } from "./args.js";

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
  const outBinsDir = myResolve(outDir, "__bin__");

  return { sourceDir, packagePath, outDir, outBinsDir };
}

export type Dirs = ReturnType<typeof resolveDirs>;
