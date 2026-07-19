import { extname } from "node:path";

const codeExtensions = new Set([".js", ".mjs", ".jsx", ".ts", ".tsx"]);
const unsupportedCodeExtensions = new Set([".cjs", ".mts", ".cts"]);

export function isCodeExport(filePath: string) {
  return codeExtensions.has(extname(filePath).toLowerCase());
}

export function isUnsupportedCodeExport(filePath: string) {
  return unsupportedCodeExtensions.has(extname(filePath).toLowerCase());
}
