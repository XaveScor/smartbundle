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

describe.concurrent("e2e", () => {
  let testLibDir = "";
  beforeAll(async () => {
    testLibDir = await fs.mkdtemp(path.join(tmpdir(), "smartbundle-test-lib"));
    await run({
      sourceDir: path.resolve(import.meta.dirname, "test-lib"),
      outputDir: testLibDir,
    });
  });

  test("bun", async () => {
    const testDirPath = path.resolve(import.meta.dirname, "bun");
    const dockerHash = buildBaseImage(testDirPath);

    expect(
      $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
    ).toMatchInlineSnapshot(`
      "cjs root default import: root/default
      cjs root named import: root/named
      cjs subroute default import: subroute/default
      cjs subroute named import: subroute/named
      cjs renamed default import: root/renamed
      cjs renamed named import: root/renamed
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
      "
    `);
  });

  describe("node", () => {
    test("v18", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node18");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
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
        "
      `);
    });

    test("v20", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node20");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
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
        "
      `);
    });

    test("v22", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node22");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
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
        "
      `);
    });

    test("v23", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node23");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "(node:8) ExperimentalWarning: CommonJS module /usr/local/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /usr/local/lib/node_modules/npm/node_modules/supports-color/index.js using require().
        Support for loading ES Module in require() is an experimental feature and might change at any time
        (Use \`node --trace-warnings ...\` to show where the warning was created)
        cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        (node:27) ExperimentalWarning: CommonJS module /usr/local/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /usr/local/lib/node_modules/npm/node_modules/supports-color/index.js using require().
        Support for loading ES Module in require() is an experimental feature and might change at any time
        (Use \`node --trace-warnings ...\` to show where the warning was created)
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
        "
      `);
    });
  });

  describe("webpack", () => {
    test("v4", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "webpack4");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > webpack

        [1G[0K   6 modules
        [1G[0K\\[1G[0Kcjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed

        > esm@1.0.0 build
        > webpack

        [1G[0K   6 modules
        [1G[0K\\[1G[0Kesm root default import: root/default
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

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > webpack

        [1G[0K[1G[0K\\[1G[0Kcjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed

        > esm@1.0.0 build
        > webpack

        [1G[0K[1G[0K\\[1G[0Kesm root default import: root/default
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
        "
      `);
    });
  });

  test("rspack", async () => {
    const testDirPath = path.resolve(import.meta.dirname, "rspack");
    const dockerHash = buildBaseImage(testDirPath);

    expect(
      $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
    ).toMatchInlineSnapshot(`
      "
      > cjs@1.0.0 build
      > rspack build

      [1G[0K[1G[0K\\[1G[0Kcjs root default import: root/default
      cjs root named import: root/named
      cjs subroute default import: subroute/default
      cjs subroute named import: subroute/named
      cjs renamed default import: root/renamed
      cjs renamed named import: root/renamed

      > esm@1.0.0 build
      > rspack build

      [1G[0K[1G[0K\\[1G[0Kesm root default import: root/default
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
      "
    `);
  });

  describe("metro", () => {
    test("v0.81", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "metro0_81");
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > metro build ./test.js --out ./test.bundle.js --platform node

        [1G[0K[32m[7m[1m BUNDLE [22m[27m[39m[0m[2m ./[22m[0m[1mtest.js[22m 

        Writing bundle output to: ./test.bundle.js
        Done writing bundle output
        [1G[0K\\[1G[0Kcjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        cjs renamed default import: root/renamed
        cjs renamed named import: root/renamed
        "
      `);
    });
  });
});
