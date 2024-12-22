import * as ts from "typescript";
import * as path from "path";

type HostFunctions = {
  getSourceFile: ts.CompilerHost["getSourceFile"];
  fileExists: ts.CompilerHost["fileExists"];
  readFile: ts.CompilerHost["readFile"];
};

function createVirtualHostFunctions(
  virtualFilePath: string,
  virtualSourceContent: string,
  originalHost: ts.CompilerHost,
): HostFunctions {
  const getSourceFile: ts.CompilerHost["getSourceFile"] = (
    fileName,
    languageVersion,
  ) => {
    if (fileName === virtualFilePath) {
      return ts.createSourceFile(
        fileName,
        virtualSourceContent,
        languageVersion,
      );
    }
    return originalHost.getSourceFile(fileName, languageVersion);
  };

  const fileExists: ts.CompilerHost["fileExists"] = (fileName) => {
    if (fileName === virtualFilePath) {
      return true;
    }
    return originalHost.fileExists(fileName);
  };

  const readFile: ts.CompilerHost["readFile"] = (fileName) => {
    if (fileName === virtualFilePath) {
      return virtualSourceContent;
    }
    return originalHost.readFile(fileName);
  };

  return {
    getSourceFile,
    fileExists,
    readFile,
  };
}

function createCompilerHostWithVirtualSource(
  packages: Set<string>,
  sourceDir: string,
) {
  const virtualSourceContent =
    [...packages].map((p) => `import "${p}";`).join("\n") +
    // for ignoring the `Generated an empty chunk: "."` error
    "export const a = 1;\n";
  const virtualFilePath = path.join(sourceDir, "virtual.ts");

  const originalHost = ts.createCompilerHost({
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    baseUrl: ".",
    sourceRoot: sourceDir,
    noEmit: true,
    emitDeclarationOnly: true,
    noEmitOnError: true,
    paths: {
      "*": ["node_modules/*"],
    },
  });
  const virtualFunctions = createVirtualHostFunctions(
    virtualFilePath,
    virtualSourceContent,
    originalHost,
  );

  return {
    host: new Proxy(originalHost, {
      get(target, prop: keyof ts.CompilerHost) {
        return virtualFunctions[prop as keyof HostFunctions] || target[prop];
      },
    }),
    virtualFilePath,
  };
}

export function findTypingsPackages(packages: Set<string>, sourceDir: string) {
  const { host, virtualFilePath } = createCompilerHostWithVirtualSource(
    packages,
    sourceDir,
  );

  const program = ts.createProgram({
    rootNames: [virtualFilePath],
    options: {},
    host: host,
  });

  const sourceFile = program.getSourceFile(virtualFilePath);
  if (!sourceFile) {
    throw new Error(
      "[getSourceFile] Impossible error inside findMissingTypings",
    );
  }

  const missingTypings = new Set<string>();
  const existingTypingPackages = new Set<string>();
  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        const moduleResolution = ts.resolveModuleName(
          moduleSpecifier.text,
          virtualFilePath,
          {},
          host,
        );

        if (!moduleResolution?.resolvedModule?.packageId) {
          missingTypings.add(moduleSpecifier.text);
        } else {
          existingTypingPackages.add(
            moduleResolution.resolvedModule.packageId.name,
          );
        }
      }
    }
  });

  return { missingTypings, existingTypingPackages };
}
