import * as ts from "typescript";
import { join, relative } from "node:path";
import { readdirSync, statSync } from "node:fs";

function createCompilerHostWithVirtualSource(sourceDir: string) {
  return ts.createCompilerHost({
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    baseUrl: ".",
    sourceRoot: sourceDir,
    noEmit: true,
    emitDeclarationOnly: true,
    noEmitOnError: true,
  });
}

/*
ChatGPT told me we need to specify all files in rootNames for the program to work correctly.
 */
function collectAllFilesInDir(sourceDir: string, ext: string) {
  const files = readdirSync(sourceDir);
  const ret = new Array<string>();
  for (const file of files) {
    // check if the file is a directory
    const stat = statSync(join(sourceDir, file));
    if (stat.isDirectory()) {
      ret.push(...collectAllFilesInDir(join(sourceDir, file), ext));
    } else if (file.endsWith(ext)) {
      ret.push(join(sourceDir, file));
    }
  }

  return ret;
}

export function findTypingsNames(
  entrypoint: string,
  sourceDir: string,
  ext: string,
) {
  const host = createCompilerHostWithVirtualSource(sourceDir);
  const program = ts.createProgram({
    rootNames: collectAllFilesInDir(sourceDir, ext),
    options: {},
    host,
  });

  const packages = new Set<string>();
  const processedFiles = new Set<string>();
  const filesQueue = [relative(sourceDir, entrypoint)];

  function processModuleSpecifier(
    filename: string,
    moduleSpecifier: ts.Expression,
  ) {
    if (!ts.isStringLiteral(moduleSpecifier)) return;

    const moduleName = moduleSpecifier.text;
    if (moduleName.startsWith(".")) {
      filesQueue.push(moduleName.replace(/\.js$/, ext));
      return;
    }

    packages.add(moduleName);
  }

  while (filesQueue.length > 0) {
    const relativeCurrentFile = filesQueue.pop()!;
    const currentFile = join(sourceDir, relativeCurrentFile);
    if (processedFiles.has(currentFile)) continue;

    const sourceFile = program.getSourceFile(currentFile);
    if (!sourceFile) continue;

    processedFiles.add(currentFile);

    ts.forEachChild(sourceFile, (node) => {
      // import "moduleSpecifier";
      if (ts.isImportDeclaration(node)) {
        processModuleSpecifier(relativeCurrentFile, node.moduleSpecifier);
      }

      // import("arguments[0]");
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments.length === 1
      ) {
        processModuleSpecifier(relativeCurrentFile, node.arguments[0]);
      }

      // export * from "moduleSpecifier";
      if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
        processModuleSpecifier(relativeCurrentFile, node.moduleSpecifier);
      }
    });
  }

  return packages;
}
