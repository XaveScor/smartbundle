import type * as TS from "typescript";
import { join } from "node:path";

// It needs for VSCode. It cannot resolve the import/export if it has no extension

export type FileExists = (path: string) => boolean;

function addExtension(
  ts: typeof import("typescript"),
  node: TS.StringLiteral,
  ext: string,
  dtsExt: string,
  fileExists: FileExists,
): TS.StringLiteral {
  const importPath = node.text;

  if (!importPath.startsWith(".")) {
    return node; // Leave external imports untouched
  }

  if (
    importPath.endsWith(".cjs") ||
    importPath.endsWith(".mjs") ||
    importPath.endsWith(".js")
  ) {
    return node;
  }

  if (fileExists(`${importPath}${dtsExt}`)) {
    return ts.factory.createStringLiteral(`${importPath}${ext}`);
  }

  if (fileExists("./" + join(importPath, `index${dtsExt}`))) {
    return ts.factory.createStringLiteral(
      "./" + join(importPath, `index${ext}`),
    );
  }

  return node; // Return the original node if no modification was made
}

function transformImportsAndExports(
  ts: typeof import("typescript"),
  content: string,
  ext: string,
  dtsExt: string,
  fileExists: FileExists,
): string {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    content,
    ts.ScriptTarget.ESNext,
    true,
  );

  const transformer: TS.TransformerFactory<TS.SourceFile> =
    (context) => (rootNode) => {
      function visit(node: TS.Node): TS.Node {
        // export {} from "moduleSpecifier";
        if (ts.isExportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier;
          if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
            const updatedSpecifier = addExtension(
              ts,
              moduleSpecifier,
              ext,
              dtsExt,
              fileExists,
            );
            return ts.factory.updateExportDeclaration(
              node,
              node.modifiers,
              node.isTypeOnly,
              node.exportClause,
              updatedSpecifier,
              node.attributes,
            );
          }
        }

        // import {} from "moduleSpecifier";
        if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier;
          if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
            const updatedSpecifier = addExtension(
              ts,
              moduleSpecifier,
              ext,
              dtsExt,
              fileExists,
            );
            return ts.factory.updateImportDeclaration(
              node,
              node.modifiers,
              node.importClause,
              updatedSpecifier,
              node.attributes,
            );
          }
        }

        // import("argument");
        if (
          ts.isCallExpression(node) &&
          node.expression.kind === ts.SyntaxKind.ImportKeyword
        ) {
          const [argument] = node.arguments;
          if (argument && ts.isStringLiteral(argument)) {
            const updatedArgument = addExtension(
              ts,
              argument,
              ext,
              dtsExt,
              fileExists,
            );
            return ts.factory.updateCallExpression(
              node,
              node.expression,
              node.typeArguments,
              [updatedArgument],
            );
          }
        }

        // Generic<import("node")>;
        if (
          ts.isStringLiteral(node) &&
          ts.isLiteralTypeNode(node.parent) &&
          node.parent.parent.kind === ts.SyntaxKind.ImportType
        ) {
          return addExtension(ts, node, ext, dtsExt, fileExists);
        }

        return ts.visitEachChild(node, visit, context);
      }

      return ts.visitNode(rootNode, visit) as TS.SourceFile;
    };

  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter();
  const transformedSourceFile = result.transformed[0];
  const output = printer.printFile(transformedSourceFile);
  result.dispose();

  return output;
}

export function inlineExtensionsMjs(
  ts: typeof import("typescript"),
  content: string,
  fileExists: FileExists,
): string {
  return transformImportsAndExports(ts, content, ".mjs", ".d.mts", fileExists);
}

export function inlineExtensionsCjs(
  ts: typeof import("typescript"),
  content: string,
  fileExists: FileExists,
): string {
  return transformImportsAndExports(ts, content, ".js", ".d.ts", fileExists);
}
