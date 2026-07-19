import { defineConfig, mergeConfig } from "vitest/config";
import { defineViteConfig } from "./src/index.js";

export default defineConfig(async () => {
  const viteConfig = await defineViteConfig();
  return mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        testTimeout: 20_000,
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        coverage: {
          provider: "v8",
          reportsDirectory: "coverage",
          include: ["src/**/*.ts"],
          exclude: [
            "src/**/*.test.ts",
            "src/test-utils.ts",
            "src/fixtures/**",
            "src/__dir_snapshots__/**",
          ],
          reporter: ["text", "html", "lcov"],
        },
        typecheck: {
          enabled: true,
        },
      },
    }),
  );
});
