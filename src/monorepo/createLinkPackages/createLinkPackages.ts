import { parsePackageJson } from "../../packageJson.js";
import { parseMonorepo } from "../parseMonorepo/parseMonorepo.js";
import path from "node:path";
import fs from "node:fs/promises";

type CreateLinkPackagesArgs = {
  sourceDir: string;
};

/**
 * Creates link packages for all SmartBundle-bundled projects in a monorepo
 * A link package is a reference package that points to the bundled output
 */
export async function createLinkPackages({
  sourceDir,
}: CreateLinkPackagesArgs) {
  // Find all SmartBundle-bundled projects in the monorepo
  const { monorepo, projectPaths } = await parseMonorepo({ sourceDir });

  if (projectPaths.length === 0) {
    console.log("No SmartBundle-bundled projects found in the monorepo");
    return;
  }

  // Create link packages for each SmartBundle-bundled project
  for (const projectPath of projectPaths) {
    const projectDir = path.join(sourceDir, projectPath);
    const projectPackageJsonPath = path.join(projectDir, "package.json");

    try {
      const projectPackageJson = await parsePackageJson({
        sourceDir: projectDir,
        packagePath: projectPackageJsonPath,
      });

      if (Array.isArray(projectPackageJson)) {
        console.error(
          `Failed to parse package.json for ${projectPath}:`,
          projectPackageJson,
        );
        continue;
      }

      // Create the link package directory inside the source package
      const linkPackageName = projectPackageJson.name.replace(
        /-sbsources$/,
        "",
      );
      const linkPackageDir = path.join(sourceDir, projectPath, "sb-dist");

      // Ensure the directory exists
      await fs.mkdir(linkPackageDir, { recursive: true });

      // Create re-export files for each export entry
      const linkExports: Record<string, string> = {};
      const reexportFiles: string[] = [];
      const reexportDirs = new Set<string>();

      if (projectPackageJson.exports) {
        for (const [exportKey, exportPath] of projectPackageJson.exports) {
          // Get the file extension from the source file
          const sourceExt = path.extname(exportPath);

          // Create the re-export file path based on the export key
          let reexportFileName: string;
          if (exportKey === ".") {
            reexportFileName = `index${sourceExt}`;
          } else {
            // Remove "./" prefix and add the source extension
            const cleanKey = exportKey.startsWith("./")
              ? exportKey.slice(2)
              : exportKey;
            reexportFileName = `${cleanKey}${sourceExt}`;
          }

          const reexportFilePath = path.join(linkPackageDir, reexportFileName);

          // Create directory for the re-export file if needed
          const reexportDir = path.dirname(reexportFilePath);
          if (reexportDir !== linkPackageDir) {
            await fs.mkdir(reexportDir, { recursive: true });
            // Track all parent directories
            let currentDir = path.relative(linkPackageDir, reexportDir);
            while (currentDir && currentDir !== ".") {
              reexportDirs.add(currentDir);
              currentDir = path.dirname(currentDir);
              if (currentDir === ".") break;
            }
          }

          // Create the re-export content
          const importPath =
            exportKey === "."
              ? projectPackageJson.name
              : `${projectPackageJson.name}/${exportKey.slice(2)}`;

          const reexportContent = `export * from "${importPath}";\n`;

          // Write the re-export file
          await fs.writeFile(reexportFilePath, reexportContent);

          // Track the file for gitignore
          reexportFiles.push(reexportFileName);

          // Add to link package exports
          linkExports[exportKey] = `./${reexportFileName}`;
        }
      }

      // Create a package.json for the link package
      const linkPackageJson = {
        name: linkPackageName,
        private: true,
        version: projectPackageJson.version ?? "0.0.0",
        type: "module" as const,
        description: `Link package for ${projectPackageJson.name}`,
        exports: linkExports,
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

      console.log(
        `Created link package for ${projectPackageJson.name} at ${linkPackageDir}`,
      );
    } catch (error) {
      console.error(`Error creating link package for ${projectPath}:`, error);
    }
  }
}
