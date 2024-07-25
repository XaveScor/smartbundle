import { Writable } from "node:stream";
import { join } from "node:path";
import type { Args } from "./args.js";
import { parsePackageJson } from "./packageJson.js";

export async function run(args: Args) {
  const sourceDir = join(process.cwd(), args.sourceDir ?? ".");
  const packagePath = join(process.cwd(), args.packagePath ?? "./package.json");
  const outputDir = join(process.cwd(), args.outputDir ?? "./dist");

  const packageJson = await parsePackageJson({ sourceDir, packagePath });

  if (Array.isArray(packageJson)) {
    const errorStream = new Writable();
    errorStream.write(`Error parsing package.json:\n`);
    for (const error of packageJson) {
      errorStream.write(`- ${error}\n`);
    }
    return { error: true, stream: errorStream };
  }
}
