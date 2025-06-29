import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { glob } from "glob";
import type { Monorepo } from "../../args.js";

type ParseMonorepoArgs = {
  sourceDir: string;
};

type DetectMonorepoTypeResult = {
  monorepo: Monorepo | null;
  projectPaths: Array<string>; // list of relative `smartbundle-bundled` project paths
};

/**
 * Detects the monorepo type and returns paths to SmartBundle-bundled projects
 * Currently only supports pnpm monorepos as per documentation
 */
export async function detectMonorepoType(
  sourceDir: string,
): Promise<DetectMonorepoTypeResult> {
  // Check if it's a pnpm monorepo by looking for pnpm-workspace.yaml
  const isPnpmMonorepo = await isPnpmWorkspace(sourceDir);

  if (!isPnpmMonorepo) {
    // Not a supported monorepo type (only pnpm is supported)
    return { monorepo: null, projectPaths: [] };
  }

  // Find all SmartBundle-bundled projects (packages with names ending in -sbsources)
  const projectPaths = await findSmartBundleBundledProjects(sourceDir);
  const devDeps = await readDevDeps(sourceDir);

  // If we can't read the root package.json, this is not a valid monorepo
  if (devDeps === null) {
    return { monorepo: null, projectPaths: [] };
  }

  return {
    monorepo: {
      type: "pnpm",
      devDeps,
    },
    projectPaths,
  };
}

async function readDevDeps(sourceDir: string): Promise<Record<string, string> | null> {
  try {
    const packageJsonPath = path.join(sourceDir, "package.json");
    const content = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(content);
    return packageJson.devDependencies ?? {};
  } catch (error) {
    return null;
  }
}

/**
 * Checks if the directory is a pnpm workspace by looking for pnpm-workspace.yaml
 */
async function isPnpmWorkspace(dir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(dir, "pnpm-workspace.yaml"));
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Finds all packages with names ending in -sbsources in the monorepo
 */
async function findSmartBundleBundledProjects(dir: string): Promise<string[]> {
  // Read the pnpm-workspace.yaml to get package patterns
  const workspaceConfig = await readPnpmWorkspaceConfig(dir);

  if (
    !workspaceConfig ||
    !workspaceConfig.packages ||
    !workspaceConfig.packages.length
  ) {
    return [];
  }

  const projectPaths: string[] = [];

  // Separate include and exclude patterns
  const includePatterns = workspaceConfig.packages.filter(
    (pattern) => !pattern.startsWith("!"),
  );
  const excludePatterns = workspaceConfig.packages
    .filter((pattern) => pattern.startsWith("!"))
    .map((pattern) => pattern.substring(1)); // Remove the leading '!'

  // Process each include pattern in the workspace config
  for (const pattern of includePatterns) {
    // For direct subdirectory patterns (without wildcards), we need to check if it's a directory
    const isDirectSubdir = !pattern.includes("*");

    // Use glob to find all directories matching the pattern
    const matches = await glob(
      // For direct subdirectories, we don't need to append a slash
      isDirectSubdir
        ? pattern
        : pattern.endsWith("/")
          ? pattern
          : `${pattern}/`,
      {
        cwd: dir,
        absolute: true,
        ignore: ["**/node_modules/**", ...excludePatterns],
      },
    );

    // Check each matched directory to see if it contains a SmartBundle-bundled project
    for (const match of matches) {
      const isSmartBundleProject = await isSmartBundleBundledProject(match);

      if (isSmartBundleProject) {
        // Convert absolute path to relative path
        const relativePath = path.relative(dir, match);
        projectPaths.push(relativePath);
      }
    }
  }

  return projectPaths;
}

/**
 * Reads and parses the pnpm-workspace.yaml file using the yaml library
 */
async function readPnpmWorkspaceConfig(
  dir: string,
): Promise<{ packages: string[] } | null> {
  try {
    const content = await fs.readFile(
      path.join(dir, "pnpm-workspace.yaml"),
      "utf-8",
    );

    // Use the yaml library to parse the content
    const parsedConfig = parseYaml(content) as { packages?: string[] };

    if (parsedConfig && Array.isArray(parsedConfig.packages)) {
      return { packages: parsedConfig.packages };
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a directory contains a SmartBundle-bundled project
 * by looking for a package.json with a name ending in -sbsources
 */
async function isSmartBundleBundledProject(dir: string): Promise<boolean> {
  try {
    const packageJsonPath = path.join(dir, "package.json");
    const content = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(content);

    // Check if the package name ends with -sbsources (case-sensitive)
    return (
      typeof packageJson.name === "string" &&
      packageJson.name.endsWith("-sbsources")
    );
  } catch (error) {
    return false;
  }
}

export async function parseMonorepo({
  sourceDir,
}: ParseMonorepoArgs): Promise<DetectMonorepoTypeResult> {
  return await detectMonorepoType(sourceDir);
}

export type { DetectMonorepoTypeResult };
