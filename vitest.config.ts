import { defineConfig, mergeConfig } from "vitest/config";
import { defineViteConfig } from "./src/index.js";

export default defineConfig(async () => {
  const viteConfig = await defineViteConfig();
  return mergeConfig(viteConfig, defineConfig({
    test: {
      testTimeout: 20_000,
      globals: true,
      setupFiles: ["./setupFile.ts"],
      typecheck: {
        enabled: true,
      },
    },
  }));
});
