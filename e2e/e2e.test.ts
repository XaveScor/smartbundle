import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as fss from "node:fs";
import { tmpdir } from "node:os";
import { describe, test, expect, beforeAll } from "vitest";
import { $ } from "zx";
import { run } from "../src/index.js";
import { existsSync } from "node:fs";

function buildBaseImage(path: string) {
  const dockerOutput = $.sync`docker build -q ${path} | sed 's/^.*://'`.text();
  return dockerOutput.trim();
}

// We need to copy the files only if they don't exist in the destination directory
function copyDirectory(srcDir: string, destDir: string) {
  fss.mkdirSync(destDir, { recursive: true });

  for (const file of fss.readdirSync(srcDir)) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    if (fss.statSync(srcFile).isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else if (!existsSync(destFile)) {
      fss.copyFileSync(srcFile, destFile);
    }
  }
}

async function prepareTestDir(testDirPath: string) {
  $.sync`git checkout -- ${testDirPath}`;
  await copyDirectory(path.resolve(import.meta.dirname, "common"), testDirPath);
}

describe("e2e", () => {
  let testLibDir = "";
  beforeAll(async () => {
    testLibDir = await fs.mkdtemp(path.join(tmpdir(), "smartbundle-test-lib"));
    await run({
      sourceDir: path.resolve(import.meta.dirname, "test-lib"),
      outputDir: testLibDir,
      command: "build",
    });
  });

  test("bun", async () => {
    const testDirPath = path.resolve(import.meta.dirname, "bun");
    await prepareTestDir(testDirPath);
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
      await prepareTestDir(testDirPath);
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
      await prepareTestDir(testDirPath);
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
      await prepareTestDir(testDirPath);
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

    test("v23", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node23");
      await prepareTestDir(testDirPath);
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
          (node:8) ExperimentalWarning: CommonJS module /usr/local/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /usr/local/lib/node_modules/npm/node_modules/supports-color/index.js using require().
          Support for loading ES Module in require() is an experimental feature and might change at any time
          (Use \`node --trace-warnings ...\` to show where the warning was created)
          (node:27) ExperimentalWarning: CommonJS module /usr/local/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /usr/local/lib/node_modules/npm/node_modules/supports-color/index.js using require().
          Support for loading ES Module in require() is an experimental feature and might change at any time
          (Use \`node --trace-warnings ...\` to show where the warning was created)
          "
        `);
    });
  });

  describe("webpack", () => {
    test("v4", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "webpack4");
      await prepareTestDir(testDirPath);
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
      await prepareTestDir(testDirPath);
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
    await prepareTestDir(testDirPath);
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
      await prepareTestDir(testDirPath);
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run  -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > metro build ./test.js --out ./test.bundle.js --platform node

         BUNDLE  ./test.js 

        Writing bundle output to: ./test.bundle.js
        Done writing bundle output
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

  describe("typescript", () => {
    function gitReset(testDirPath: string) {
      $.sync`git checkout -- ${testDirPath}`;
    }

    function linkTestLib(testDirPath: string, testLibPath: string) {
      $.sync`pnpm link --silent --dir ${testDirPath} ${testLibPath}`;
    }

    function runTsCheck(testDirPath: string) {
      return $.sync`pnpm run --silent --dir ${testDirPath} test-types`.text();
    }

    describe("moduleResolution", () => {
      test("node10", () => {
        const testDirPath = path.resolve(
          import.meta.dirname,
          "typescript",
          "node10",
        );

        try {
          linkTestLib(testDirPath, testLibDir);

          expect(runTsCheck(testDirPath)).toMatchInlineSnapshot(`""`);
        } finally {
          gitReset(testDirPath);
        }
      });

      test("bundler", () => {
        const testDirPath = path.resolve(
          import.meta.dirname,
          "typescript",
          "bundler",
        );

        try {
          linkTestLib(testDirPath, testLibDir);

          expect(runTsCheck(testDirPath)).toMatchInlineSnapshot(`""`);
        } finally {
          gitReset(testDirPath);
        }
      });

      test("node16cjs", () => {
        const testDirPath = path.resolve(
          import.meta.dirname,
          "typescript",
          "node16cjs",
        );

        try {
          linkTestLib(testDirPath, testLibDir);

          expect(runTsCheck(testDirPath)).toMatchInlineSnapshot(`""`);
        } finally {
          gitReset(testDirPath);
        }
      });

      test("node16es", () => {
        const testDirPath = path.resolve(
          import.meta.dirname,
          "typescript",
          "node16es",
        );

        try {
          linkTestLib(testDirPath, testLibDir);

          expect(runTsCheck(testDirPath)).toMatchInlineSnapshot(`""`);
        } finally {
          gitReset(testDirPath);
        }
      });
    });
  });
});
