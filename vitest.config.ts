import { defineConfig, mergeConfig } from "vitest/config";
import { defineViteConfig } from "./src/index.js";

export default defineConfig(async () => {
  const viteConfig = await defineViteConfig();
  return mergeConfig(viteConfig, {
    test: {
      globals: true,
      setupFiles: ["./setupFile.ts"],
      typecheck: {
        enabled: true,
      },
    },
  });
});
