import { join } from "node:path";
import { parseMonorepo } from "./parseMonorepo/parseMonorepo.js";
import { run } from "../index.js";
import { type Args } from "../args.js";
import { log, lineLog } from "../log.js";
import { PrettyError } from "../PrettyErrors.js";

export type MonorepoBuildResult = {
  totalPackages: number;
  successfulBuilds: number;
  failedBuilds: number;
  errors: Array<{ packagePath: string; errors: Array<string | PrettyError> }>;
};

export async function buildMonorepo(args: Args): Promise<MonorepoBuildResult> {
  const sourceDir = args.sourceDir || process.cwd();

  // Use existing monorepo detection
  const { monorepo, projectPaths } = await parseMonorepo({ sourceDir });

  if (!monorepo) {
    throw new PrettyError("Not a monorepo - pnpm-workspace.yaml not found");
  }

  if (projectPaths.length === 0) {
    throw new PrettyError(
      "No packages with -sbsources suffix found in monorepo",
    );
  }

  log(`Found ${projectPaths.length} packages to build in monorepo`);
  lineLog();

  const result: MonorepoBuildResult = {
    totalPackages: projectPaths.length,
    successfulBuilds: 0,
    failedBuilds: 0,
    errors: [],
  };

  // Build each package sequentially for now
  // TODO: Add dependency analysis and parallel builds
  for (let i = 0; i < projectPaths.length; i++) {
    const packagePath = projectPaths[i];
    const packageSourceDir = join(sourceDir, packagePath);

    log(`[${i + 1}/${projectPaths.length}] Building ${packagePath}...`);

    // Create args for this specific package
    const packageArgs: Args = {
      ...args,
      sourceDir: packageSourceDir,
      packagePath: join(packageSourceDir, "package.json"),
      outputDir: join(packageSourceDir, "sb-dist"),
      monorepo,
    };

    // Reuse existing run logic
    const buildResult = await run(packageArgs);

    if (buildResult.error) {
      result.failedBuilds++;
      result.errors.push({
        packagePath,
        errors: buildResult.errors,
      });
      log(
        `[${i + 1}/${projectPaths.length}] ❌ Failed to build ${packagePath}`,
      );
    } else {
      result.successfulBuilds++;
      log(`[${i + 1}/${projectPaths.length}] ✅ Built ${packagePath}`);
    }

    lineLog();
  }

  // Summary
  log(`Monorepo build completed:`);
  log(`  Total packages: ${result.totalPackages}`);
  log(`  Successful: ${result.successfulBuilds}`);
  log(`  Failed: ${result.failedBuilds}`);

  return result;
}
