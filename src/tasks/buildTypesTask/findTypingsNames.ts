import type * as ts from "typescript";
import { join, relative } from "node:path";
import { readdirSync, statSync } from "node:fs";
import type { TSModule } from "../../detectModules.js";

function createCompilerHostWithVirtualSource(ts: TSModule["ts"], sourceDir: string) {
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
  { ts }: TSModule,
  entrypoint: string,
  sourceDir: string,
  ext: string,
) {
  const host = createCompilerHostWithVirtualSource(ts, sourceDir);
  const program = ts.createProgram({
    rootNames: collectAllFilesInDir(sourceDir, ext),
    options: {},
    host,
  });

  const packages = new Set<string>();
  const processedFiles = new Set<string>();
  const filesQueue = [relative(sourceDir, entrypoint)];

  function processModuleSpecifier(moduleSpecifier: ts.StringLiteral) {
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

    function visit(node: ts.Node) {
      // import "moduleSpecifier";
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        processModuleSpecifier(node.moduleSpecifier);
      }

      // Generic<import("node")>;
      if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal)
      ) {
        processModuleSpecifier(node.argument.literal);
      }

      // export * from "moduleSpecifier";
      if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        processModuleSpecifier(node.moduleSpecifier);
      }

      ts.forEachChild(node, visit);
    }

    processedFiles.add(currentFile);

    ts.forEachChild(sourceFile, visit);
  }

  return packages;
}
