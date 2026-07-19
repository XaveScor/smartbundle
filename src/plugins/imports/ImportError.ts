import { PrettyError } from "../../PrettyErrors.js";

export class ImportError extends PrettyError {
  private constructor(
    private importName: string,
    private path: string | undefined,
  ) {
    super(
      `ImportError: The "${importName}" library is marked as an optional dependency.\n` +
        `It cannot be imported directly in:\n` +
        `  "${path ?? "unknown path"}"\n\n` +
        `To resolve this, consider:\n` +
        `1. Using a type import (e.g., 'import type').\n` +
        `2. Dynamically importing the library (e.g., 'await import("${importName}")').\n\n` +
        `This ensures compatibility with environments where "${importName}" is not installed.`,
    );
  }

  static async create(
    importName: string,
    path: string | undefined,
    fsReadFile: typeof import("fs/promises").readFile,
  ) {
    if (!path) {
      return new ImportError(importName, path);
    }
    const content = await fsReadFile(path, "utf-8");
    const lines = content.split("\n");

    const escapedImportName = importName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const importPattern = new RegExp(
      `\\b(?:import|export)\\b.*(?:from\\s*)?["']${escapedImportName}["']`,
    );
    const affectedLine = lines.findIndex((line) => importPattern.test(line));

    const error = new ImportError(importName, path);
    const lineNumber = affectedLine < 0 ? 1 : affectedLine + 1;
    error.stack = `ImportError: you cannot import ${importName} because it marked as optional inside package.json \n
    at ${path}:${lineNumber}:0`;

    return error;
  }
}
