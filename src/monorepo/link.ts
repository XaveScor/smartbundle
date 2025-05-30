import { args } from "../args.js";
import { resolveDirs, type Dirs } from "../resolveDirs.js";
import { mkdir, rm } from "node:fs/promises";
import { initMonorepo } from "./init.js";
import { parsePackageJson, type PackageJson } from "../packageJson.js";
import { parseMonorepo } from "./parseMonorepo/parseMonorepo.js";
import path from "node:path";
import fs from "node:fs/promises";

/**
 * Creates link packages for all SmartBundle-bundled projects in a monorepo
 * A link package is a reference package that points to the bundled output
 */
export async function createLinkPackages(dirs: Dirs, packageJson: PackageJson) {
  // Find all SmartBundle-bundled projects in the monorepo
  const { projectPaths } = await parseMonorepo({ dirs });

  if (projectPaths.length === 0) {
    console.log("No SmartBundle-bundled projects found in the monorepo");
    return;
  }

  // Create link packages for each SmartBundle-bundled project
  for (const projectPath of projectPaths) {
    const projectDir = path.join(dirs.sourceDir, projectPath);
    const projectPackageJsonPath = path.join(projectDir, "package.json");

    try {
      // Read the project's package.json
      const projectPackageJsonContent = await fs.readFile(
        projectPackageJsonPath,
        "utf-8",
      );
      const projectPackageJson = await parsePackageJson({
        sourceDir: projectDir,
        packagePath: projectPackageJsonContent,
      });

      if (Array.isArray(projectPackageJson)) {
        console.error(
          `Failed to parse package.json for ${projectPath}:`,
          projectPackageJson,
        );
        continue;
      }

      // Create the link package directory
      const linkPackageName = projectPackageJson.name.replace(
        /-sbsources$/,
        "",
      );
      const linkPackageDir = path.join(
        dirs.outDir,
        projectPath.replace(/-sbsources$/, ""),
      );

      // Ensure the directory exists
      await fs.mkdir(linkPackageDir, { recursive: true });

      // Create a package.json for the link package
      const linkPackageJson = {
        name: linkPackageName,
        version: projectPackageJson.version ?? "0.0.0",
        description: `Link package for ${projectPackageJson.name}`,
        // Add a devDependency on the source package to create a wire between source and dist
        devDependencies: {
          [projectPackageJson.name]: "workspace:*",
        },
      };

      // Write the package.json for the link package
      await fs.writeFile(
        path.join(linkPackageDir, "package.json"),
        JSON.stringify(linkPackageJson, null, 2),
      );

      // Create a .gitignore file to ignore everything except package.json
      const gitignoreContent = `# Ignore all files
*
# Unignore the following files
!.gitignore
!package.json
`;
      await fs.writeFile(
        path.join(linkPackageDir, ".gitignore"),
        gitignoreContent,
      );

      console.log(
        `Created link package for ${projectPackageJson.name} at ${linkPackageDir}`,
      );
    } catch (error) {
      console.error(`Error creating link package for ${projectPath}:`, error);
    }
  }
}

(async () => {
  const dirs = resolveDirs(args);
  const { outDir, sourceDir, packagePath } = dirs;

  const packageJson = await parsePackageJson({ sourceDir, packagePath });
  if (Array.isArray(packageJson)) {
    console.error(packageJson);
    throw new Error("Failed to parse package.json");
  }
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Initialize the monorepo
  await initMonorepo(dirs, packageJson);

  // Create link packages for all SmartBundle-bundled projects
  await createLinkPackages(dirs, packageJson);

  console.log("Monorepo link packages created successfully");
  console.log("Run 'pnpm install' to update dependencies");
})();
