import * as path from "node:path";
import * as fs from "node:fs";

type BuildTypesOptions = {
  ts: typeof import("typescript");
  sourceDir: string;
  files: string[];
  outDir: string;
};

export async function callTypescript({
  ts,
  sourceDir,
  files,
  outDir,
}: BuildTypesOptions) {
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
      // https://github.com/XaveScor/bobrik/issues/22#issuecomment-2308552352
      noEmit: false,
    },
    configPath,
  );

  const host = ts.createCompilerHost(parsedCommandLine.options);

  const sourceToDtsMap = new Map<string, string>();
  const program = ts.createProgram(files, parsedCommandLine.options, host);
  program.emit(undefined, (fileName, data) => {
    const relativePath = path.relative(sourceDir, fileName);
    const esmFinalPath = path.join(outDir, relativePath);
    const sourceFileName = fileName.replace(/\.d\.ts$/, ".ts"); // Assuming source files have .ts extension
    sourceToDtsMap.set(esmFinalPath, sourceFileName);
    fs.mkdirSync(path.dirname(esmFinalPath), { recursive: true });
    fs.writeFileSync(esmFinalPath, data);
    // cjs requires .d.ts files to be in the same directory as the source file.
    const cjsFinalPath = esmFinalPath.replace(/\.d\.ts$/, ".d.cts");
    fs.writeFileSync(cjsFinalPath, data);
    sourceToDtsMap.set(cjsFinalPath, sourceFileName);
  });

  return sourceToDtsMap;
}
