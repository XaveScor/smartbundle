import * as path from "node:path";
import * as fs from "node:fs";
import {
  inlineExtensionsMjs,
  inlineExtensionsCjs,
} from "./inlineExtensions.js";
import { type PackageJson } from "../../packageJson.js";
import { getMinVersion } from "../../detectModules.js";
import { BuildError } from "../../error.js";

type BuildTypesOptions = {
  ts: typeof import("typescript");
  sourceDir: string;
  packageJson: PackageJson;
  files: string[];
  outDir: string;
};

function makeFileExists(outDir: string, filePath: string) {
  return (p: string) => {
    const dir = path.join(outDir, path.dirname(filePath));
    return fs.existsSync(path.join(dir, p));
  };
}

export async function callTypescript({
  ts,
  sourceDir,
  files,
  packageJson,
  outDir,
}: BuildTypesOptions) {
  // <build d.ts>
  const configPath = path.join(sourceDir, "tsconfig.json");
  const configFile = ts.readConfigFile(configPath, (path) =>
    // https://github.com/XaveScor/bobrik/issues/22
    fs.readFileSync(path, "utf-8"),
  );

  const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    sourceDir,
    {
      declaration: true,
      emitDeclarationOnly: true,
      strict: false,
      strictNullChecks: false,
      strictFunctionTypes: false,
      strictPropertyInitialization: false,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      outDir: "",
      // https://github.com/XaveScor/bobrik/issues/22#issuecomment-2308552352
      noEmit: false,
    },
    configPath,
  );

  const host = ts.createCompilerHost(parsedCommandLine.options);

  const sourceToDtsMap = new Map<string, string>();
  const program = ts.createProgram(files, parsedCommandLine.options, host);
  program.emit(undefined, (fileName, data) => {
    // .d.ts for cjs because "type": "commonjs" in package.json
    // .d.mts for esm
    const relativePath = path.relative(sourceDir, fileName);
    const sourceFileName = fileName.replace(/\.d\.ts$/, ".ts"); // Assuming source files have .ts extension

    const finalEsmPath = path.join(outDir, "__compiled__", "esm", relativePath);
    const esmFinalPath = finalEsmPath.replace(/\.d\.ts$/, ".d.mts");
    sourceToDtsMap.set(esmFinalPath, sourceFileName);
    fs.mkdirSync(path.dirname(esmFinalPath), { recursive: true });
    fs.writeFileSync(esmFinalPath, data);

    const finalCjsPath = path.join(outDir, "__compiled__", "cjs", relativePath);
    fs.mkdirSync(path.dirname(finalCjsPath), { recursive: true });
    const cjsFinalPath = finalCjsPath;
    fs.writeFileSync(cjsFinalPath, data);
    sourceToDtsMap.set(cjsFinalPath, sourceFileName);
  });

  // </build d.ts>

  const allImportedLibraries = new Set<string>();
  // <fix vscode typings>
  for (const file of sourceToDtsMap.keys()) {
    const content = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(outDir, file);
    if (file.endsWith(".d.ts")) {
      const transformedCode = inlineExtensionsCjs(
        ts,
        content,
        makeFileExists(outDir, relativePath),
      );
      for (const lib of transformedCode.usedLibraries.values()) {
        allImportedLibraries.add(lib);
      }
      fs.writeFileSync(file, transformedCode.output);
    }
    if (file.endsWith(".d.mts")) {
      const transformedCode = inlineExtensionsMjs(
        ts,
        content,
        makeFileExists(outDir, relativePath),
      );
      for (const lib of transformedCode.usedLibraries.values()) {
        allImportedLibraries.add(lib);
      }
      fs.writeFileSync(file, transformedCode.output);
    }
  }
  // </fix vscode typings>

  // <check not installed typings libraries>
  const notInstalledLibraries = new Set<string>();
  for (const lib of allImportedLibraries) {
    if (
      getMinVersion(packageJson, lib, [
        "optionalDependencies",
        "devDependencies",
      ]) == null
    ) {
      notInstalledLibraries.add(lib);
    }
  }
  if (notInstalledLibraries.size > 0) {
    const libsList = [...notInstalledLibraries].map((x) => `"${x}"`).join(", ");
    throw new BuildError(
      `You use types from dependencies that are not installed: ${libsList}. Please install them into dependencies or peerDependencies.`,
    );
  }
  // </check not installed typings libraries>

  return sourceToDtsMap;
}
