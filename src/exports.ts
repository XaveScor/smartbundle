import { extname } from "node:path";

const codeExtensions = new Set([".js", ".mjs", ".jsx", ".ts", ".tsx"]);

export function isCodeExport(filePath: string) {
  return codeExtensions.has(extname(filePath).toLowerCase());
}
