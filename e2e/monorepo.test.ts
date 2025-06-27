import * as path from "node:path";
import * as fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { describe, test, expect, beforeAll } from "vitest";
import { $ } from "zx";
import { run } from "../src/index.js";

function buildBaseImage(path: string) {
  const dockerOutput = $.sync`docker build -q ${path} | sed 's/^.*://'`.text();
  return dockerOutput.trim();
}

function removePnpmUnstableLog(log: string) {
  // added 1 package 923983289ms
  return log.replace(/added.*ms/, "");
}

describe("monorepo e2e", () => {
  let smartbundleDir = "";
  beforeAll(async () => {
    smartbundleDir = await fs.mkdtemp(path.join(tmpdir(), "smartbundle-bin"));
    await run({
      sourceDir: path.resolve(import.meta.dirname, ".."),
      outputDir: smartbundleDir,
    });
  });

  describe("pnpm", () => {
    test("typescript-types", { timeout: 60000 }, async () => {
      const testDirPath = path.resolve(
        import.meta.dirname,
        "monorepo",
        "pnpm",
        "typescript-types",
      );

      const dockerHash = buildBaseImage(testDirPath);

      const result = $.sync`docker run -v ${smartbundleDir}:/smartbundle ${dockerHash}`;

      expect(result.exitCode).toBe(0);
      expect(removePnpmUnstableLog(result.text())).toMatchInlineSnapshot(`""`);
    });

    test("build-all-packages", { timeout: 60000 }, async () => {
      const testDirPath = path.resolve(
        import.meta.dirname,
        "monorepo",
        "pnpm",
        "build-all-packages",
      );

      const dockerHash = buildBaseImage(testDirPath);

      const result = $.sync`docker run -v ${smartbundleDir}:/smartbundle ${dockerHash}`;

      expect(result.exitCode).toBe(0);
      expect(result.text()).toMatchInlineSnapshot(`
        "
        > build-all-packages-monorepo@1.0.0 build /app
        > smartbundle

        Found 2 packages to build in monorepo
        ========================================
        [1/2] Building packages/utils...
        Detecting modules
        ❌ typescript
        ❌ babel
        ❌ react
        ========================================
        Detecting modules
        ❌ babel
        ❌ react
        ✅ typescript, version: 5.8.3
        ========================================
        ✅ .d.ts
        ✅ Static files: 
        ✅ Vite
        ✅ no-exports compat layer
        ✅ package.json
        ========================================
        Build finished: ./sb-dist
        [1/2] ✅ Built packages/utils
        ========================================
        [2/2] Building packages/logger...
        Detecting modules
        ❌ typescript
        ❌ babel
        ❌ react
        ========================================
        Detecting modules
        ❌ babel
        ❌ react
        ✅ typescript, version: 5.8.3
        ========================================
        ✅ .d.ts
        ✅ Static files: 
        ✅ Vite
        ✅ no-exports compat layer
        ✅ package.json
        ========================================
        Build finished: ./sb-dist
        [2/2] ✅ Built packages/logger
        ========================================
        Monorepo build completed:
          Total packages: 2
          Successful: 2
          Failed: 0
        Checking utils package build...
        Checking logger package build...
        Testing utils package...
        utils: Hello from utils package!
        greet: Hello, World!
        add: 5
        Testing logger package...
        [LOG] Test message
        version: 1.0.0
        Monorepo build test completed successfully!
        [ERROR] Test error
        "
      `);
    });
  });
});
