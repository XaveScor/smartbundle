import { join } from "node:path";
import { defineConfig, mergeConfig } from "vitest/config";
import { defineViteConfig } from "smartbundle";

export default defineConfig(async () =>
  mergeConfig(
    await defineViteConfig({
      sourceDir: import.meta.dirname,
      outputDir: join(import.meta.dirname, "dist"),
    }),
    defineConfig({ test: { include: ["compat.ts"] } }),
  ),
);
