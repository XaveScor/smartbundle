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
      expect(removePnpmUnstableLog(result.text())).toMatchInlineSnapshot(`
          "

          "
        `);
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
        added 1 package in 366ms
        Created link package for @test/utils-sbsources at /app/packages/utils/dist
        Created link package for @test/logger-sbsources at /app/packages/logger/dist
        Monorepo link packages created successfully
        Run 'pnpm install' to update dependencies

        removed 1 package in 341ms
        Scope: all 3 workspace projects
        Progress: resolved 1, reused 0, downloaded 0, added 0

           ╭──────────────────────────────────────────╮
           │                                          │
           │   Update available! 10.11.1 → 10.12.2.   │
           │   Changelog: https://pnpm.io/v/10.12.2   │
           │     To update, run: pnpm add -g pnpm     │
           │                                          │
           ╰──────────────────────────────────────────╯

        Progress: resolved 7, reused 1, downloaded 3, added 0
        Progress: resolved 25, reused 1, downloaded 22, added 0
        Progress: resolved 38, reused 1, downloaded 33, added 0
        Progress: resolved 45, reused 1, downloaded 37, added 0
        Progress: resolved 55, reused 1, downloaded 39, added 0
        Progress: resolved 70, reused 1, downloaded 39, added 0
        Progress: resolved 104, reused 1, downloaded 53, added 0
        Progress: resolved 113, reused 1, downloaded 69, added 0
        Packages: +71
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        Progress: resolved 114, reused 1, downloaded 70, added 71, done

        devDependencies:
        + smartbundle 0.15.0-alpha.0
        + typescript 5.8.3

        ╭ Warning ─────────────────────────────────────────────────────────────────────╮
        │                                                                              │
        │   Ignored build scripts: esbuild.                                            │
        │   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
        │   to run scripts.                                                            │
        │                                                                              │
        ╰──────────────────────────────────────────────────────────────────────────────╯

        Done in 9.1s using pnpm v10.11.1

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
        Build finished: ./dist
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
        Build finished: ./dist
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
