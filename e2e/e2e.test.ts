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

describe("e2e", () => {
  let testLibDir = "";
  beforeAll(async () => {
    testLibDir = await fs.mkdtemp(path.join(tmpdir(), "smartbundle-test-lib"));
    await run({
      sourceDir: path.resolve(import.meta.dirname, "test-lib"),
      outputDir: testLibDir,
      skipGitignore: true,
    });
  });

  test("bun", async () => {
    const testDirPath = path.resolve(import.meta.dirname, "bun");
    const dockerHash = buildBaseImage(testDirPath);

    expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
      .toMatchInlineSnapshot(`
      "cjs root default import: root/default
      cjs root named import: root/named
      cjs subroute default import: subroute/default
      cjs subroute named import: subroute/named
      cjs renamed default import: root/renamed
      cjs renamed named import: root/renamed
      cjs only default import: onlyDefault/default
      cjs only named import: onlyNamed/named
      onlySideEffect
      onlySideEffect
      esm root default import: root/default
      esm root named import: root/named
      esm root dynamic default import: root/default
      esm root dynamic named import: root/named
      esm subroute default import: subroute/default
      esm subroute named import: subroute/named
      esm subroute dynamic default import: subroute/default
      esm subroute dynamic named import: subroute/named
      esm renamed default import: root/renamed
      esm renamed named import: root/renamed
      esm renamed dynamic default import: root/renamed
      esm renamed dynamic named import: root/renamed
      esm only default import: onlyDefault/default
      esm only dynamic default import: onlyDefault/default
      esm only named import: onlyNamed/named
      esm only dynamic named import: onlyNamed/named
      esm only side effect import
      esm only dynamic side effect import
      "
    `);
  });

  describe("node", () => {
    test("v18", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node18");
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        cjs only default import: onlyDefault/default
        cjs only named import: onlyNamed/named
        onlySideEffect
        onlySideEffect
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        esm renamed default import: root/renamed
        esm renamed named import: root/renamed
        esm renamed dynamic default import: root/renamed
        esm renamed dynamic named import: root/renamed
        esm only default import: onlyDefault/default
        esm only dynamic default import: onlyDefault/default
        esm only named import: onlyNamed/named
        esm only dynamic named import: onlyNamed/named
        esm only side effect import
        esm only dynamic side effect import
        "
      `);
    });

    test("v20", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node20");
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        cjs only default import: onlyDefault/default
        cjs only named import: onlyNamed/named
        onlySideEffect
        onlySideEffect
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        esm renamed default import: root/renamed
        esm renamed named import: root/renamed
        esm renamed dynamic default import: root/renamed
        esm renamed dynamic named import: root/renamed
        esm only default import: onlyDefault/default
        esm only dynamic default import: onlyDefault/default
        esm only named import: onlyNamed/named
        esm only dynamic named import: onlyNamed/named
        esm only side effect import
        esm only dynamic side effect import
        "
      `);
    });

    test("v22", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node22");
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        cjs only default import: onlyDefault/default
        cjs only named import: onlyNamed/named
        onlySideEffect
        onlySideEffect
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        esm renamed default import: root/renamed
        esm renamed named import: root/renamed
        esm renamed dynamic default import: root/renamed
        esm renamed dynamic named import: root/renamed
        esm only default import: onlyDefault/default
        esm only dynamic default import: onlyDefault/default
        esm only named import: onlyNamed/named
        esm only dynamic named import: onlyNamed/named
        esm only side effect import
        esm only dynamic side effect import
        "
      `);
    });

    test("v24", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node24");
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`
          "cjs root default import: root/default
          cjs root named import: root/named
          cjs subroute default import: subroute/default
          cjs subroute named import: subroute/named
          cjs renamed default import: root/renamed
          cjs renamed named import: root/renamed
          cjs only default import: onlyDefault/default
          cjs only named import: onlyNamed/named
          onlySideEffect
          onlySideEffect
          esm root default import: root/default
          esm root named import: root/named
          esm root dynamic default import: root/default
          esm root dynamic named import: root/named
          esm subroute default import: subroute/default
          esm subroute named import: subroute/named
          esm subroute dynamic default import: subroute/default
          esm subroute dynamic named import: subroute/named
          esm renamed default import: root/renamed
          esm renamed named import: root/renamed
          esm renamed dynamic default import: root/renamed
          esm renamed dynamic named import: root/renamed
          esm only default import: onlyDefault/default
          esm only dynamic default import: onlyDefault/default
          esm only named import: onlyNamed/named
          esm only dynamic named import: onlyNamed/named
          esm only side effect import
          esm only dynamic side effect import
          "
        `);
    });
  });

  describe("webpack", () => {
    test("v4", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "webpack4");
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`
          "
          > cjs@1.0.0 build
          > webpack

             12 modules
          cjs root default import: root/default
          cjs root named import: root/named
          cjs subroute default import: subroute/default
          cjs subroute named import: subroute/named
          cjs renamed default import: root/renamed
          cjs renamed named import: root/renamed
          cjs only default import: onlyDefault/default
          cjs only named import: onlyNamed/named
          onlySideEffect

          > esm@1.0.0 build
          > webpack

             6 modules
          esm root default import: root/default
          esm root named import: root/named
          esm subroute default import: subroute/default
          esm subroute named import: subroute/named
          esm renamed default import: root/renamed
          esm renamed named import: root/renamed
          esm root dynamic default import: root/default
          esm root dynamic named import: root/named
          esm subroute dynamic default import: subroute/default
          esm subroute dynamic named import: subroute/named
          esm renamed dynamic default import: root/renamed
          esm renamed dynamic named import: root/renamed
          "
        `);
    });

    test("v5", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "webpack5");
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`
          "
          > cjs@1.0.0 build
          > webpack

          cjs root default import: root/default
          cjs root named import: root/named
          cjs subroute default import: subroute/default
          cjs subroute named import: subroute/named
          cjs renamed default import: root/renamed
          cjs renamed named import: root/renamed
          cjs only default import: onlyDefault/default
          cjs only named import: onlyNamed/named
          onlySideEffect

          > esm@1.0.0 build
          > webpack

          onlySideEffect
          esm root default import: root/default
          esm root named import: root/named
          esm root dynamic default import: root/default
          esm root dynamic named import: root/named
          esm subroute default import: subroute/default
          esm subroute named import: subroute/named
          esm subroute dynamic default import: subroute/default
          esm subroute dynamic named import: subroute/named
          esm renamed default import: root/renamed
          esm renamed named import: root/renamed
          esm renamed dynamic default import: root/renamed
          esm renamed dynamic named import: root/renamed
          esm only default import: onlyDefault/default
          esm only dynamic default import: onlyDefault/default
          esm only named import: onlyNamed/named
          esm only dynamic named import: onlyNamed/named
          esm only side effect import
          esm only dynamic side effect import
          "
        `);
    });
  });

  test("rspack", async () => {
    const testDirPath = path.resolve(import.meta.dirname, "rspack");
    const dockerHash = buildBaseImage(testDirPath);

    expect($.sync`docker run  -v ${testLibDir}:/test-lib ${dockerHash}`.text())
      .toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > rspack build

        cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        cjs only default import: onlyDefault/default
        cjs only named import: onlyNamed/named
        onlySideEffect

        > esm@1.0.0 build
        > rspack build

        onlySideEffect
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        esm renamed default import: root/renamed
        esm renamed named import: root/renamed
        esm renamed dynamic default import: root/renamed
        esm renamed dynamic named import: root/renamed
        esm only default import: onlyDefault/default
        esm only dynamic default import: onlyDefault/default
        esm only named import: onlyNamed/named
        esm only dynamic named import: onlyNamed/named
        esm only side effect import
        esm only dynamic side effect import
        "
      `);
  });

  describe("metro", () => {
    test("v0.81", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "metro0_81");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run  -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > metro build ./test.js --out ./test.bundle.js --platform node

         BUNDLE  ./test.js 

        cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        cjs only default import: onlyDefault/default
        cjs only named import: onlyNamed/named
        onlySideEffect
        "
      `);
    });
  });

  test("gitignore", async () => {
    const gitignoreTestLibDir = await fs.mkdtemp(
      path.join(tmpdir(), "smartbundle-gitignore-test-lib"),
    );
    await run({
      sourceDir: path.resolve(import.meta.dirname, "gitignore"),
      outputDir: gitignoreTestLibDir,
    });

    const testDirPath = path.resolve(import.meta.dirname, "gitignore");
    const dockerHash = buildBaseImage(testDirPath);

    expect(
      $.sync`docker run -v ${gitignoreTestLibDir}:/test-lib ${dockerHash}`.text(),
    ).toMatchInlineSnapshot(`
        "=== Gitignore Plugin E2E Test ===
        Phase 1: Verifying built files
        ✓ .gitignore contains '*'
        ✓ .npmignore is empty
        Phase 2: Testing git behavior
        ✓ Git ignores all files
        Phase 3: Testing pnpm pack
        ✓ pnpm pack created tarball
        Phase 4: Comparing files
        ✓ Essential files verified
        === All tests passed! ===
        ✓ .gitignore ignores all files from git
        ✓ .npmignore allows all files for npm packaging
        ✓ Tarball matches built files exactly
        "
      `);
  });
});
