import * as path from "node:path";
import * as fs from "node:fs";

type BuildTypesOptions = {
  sourceDir: string;
  files: string[];
  outDir: string;
};

export async function buildTypes({
  sourceDir,
  files,
  outDir,
}: BuildTypesOptions) {
  const ts = await import("typescript");
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
    },
    configPath,
  );

  const host = ts.createCompilerHost(parsedCommandLine.options);

  const sourceToDtsMap = new Map<string, string>();
  const program = ts.createProgram(files, parsedCommandLine.options, host);
  program.emit(undefined, (fileName, data) => {
    const relativePath = path.relative(sourceDir, fileName);
    const finalPath = path.join(outDir, relativePath);
    const sourceFileName = fileName.replace(/\.d\.ts$/, ".ts"); // Assuming source files have .ts extension
    sourceToDtsMap.set(sourceFileName, finalPath);
    fs.writeFileSync(finalPath, data);
  });

  return sourceToDtsMap;
}
