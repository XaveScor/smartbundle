import { join } from "node:path";
import { rename } from "node:fs/promises";

export async function renameOutput(outDir: string) {
  // vite cannot generate mjs files
  await rename(join(outDir, "bundle.js"), join(outDir, "bundle.mjs"));
}
