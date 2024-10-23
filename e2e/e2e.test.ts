import * as path from "node:path";
import * as fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { $ } from "zx";
import { run } from "../src/index.js";

$.quote = (x) => x;

describe.concurrent("e2e", () => {
  let testLibDir = "";
  beforeAll(async () => {
    testLibDir = await fs.mkdtemp(path.join(tmpdir(), "smartbundle-test-lib"));
    await run({
      sourceDir: path.resolve(import.meta.dirname, "test-lib"),
      outputDir: testLibDir,
    });
  });
  afterAll(async () => {
    await fs.rm(testLibDir, { recursive: true, force: true });
  });

  test("bun", async () => {
    const testDirPath = path.resolve(import.meta.dirname, "bun");
    const dockerHash =
      $.sync`docker build -q ${testDirPath} | sed 's/^.*://'`.text();

    expect(
      $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
    ).toMatchInlineSnapshot(`
      "cjs root default import: root/default
      cjs root named import: root/named
      cjs subroute default import: subroute/default
      cjs subroute named import: subroute/named
      esm root default import: root/default
      esm root named import: root/named
      esm root dynamic default import: root/default
      esm root dynamic named import: root/named
      esm subroute default import: subroute/default
      esm subroute named import: subroute/named
      esm subroute dynamic default import: subroute/default
      esm subroute dynamic named import: subroute/named
      "
    `);
  });

  describe("node", () => {
    test("v18", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node18");
      const dockerHash =
        $.sync`docker build -q ${testDirPath} | sed 's/^.*://'`.text();

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        "
      `);
    });

    test("v20", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node20");
      const dockerHash =
        $.sync`docker build -q ${testDirPath} | sed 's/^.*://'`.text();

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        "
      `);
    });

    test("v22", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node22");
      const dockerHash =
        $.sync`docker build -q ${testDirPath} | sed 's/^.*://'`.text();

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        "
      `);
    });

    test("v23", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "node23");
      const dockerHash =
        $.sync`docker build -q ${testDirPath} | sed 's/^.*://'`.text();

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "(node:8) ExperimentalWarning: Support for loading ES Module in require() is an experimental feature and might change at any time
        (Use \`node --trace-warnings ...\` to show where the warning was created)
        cjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named
        (node:27) ExperimentalWarning: Support for loading ES Module in require() is an experimental feature and might change at any time
        (Use \`node --trace-warnings ...\` to show where the warning was created)
        esm root default import: root/default
        esm root named import: root/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        "
      `);
    });
  });

  describe("webpack", () => {
    test("v4", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "webpack4");
      const dockerHash =
        $.sync`docker build -q ${testDirPath} | sed 's/^.*://'`.text();

      expect(
        $.sync`docker run -it -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`
        "
        > cjs@1.0.0 build
        > webpack

        [1G[0K   3 modules
        [1G[0K\\[1G[0Kcjs root default import: root/default
        cjs root named import: root/named
        cjs subroute default import: subroute/default
        cjs subroute named import: subroute/named

        > esm@1.0.0 build
        > webpack

        [1G[0K   3 modules
        [1G[0K\\[1G[0Kesm root default import: root/default
        esm root named import: root/named
        esm subroute default import: subroute/default
        esm subroute named import: subroute/named
        esm root dynamic default import: root/default
        esm root dynamic named import: root/named
        esm subroute dynamic default import: subroute/default
        esm subroute dynamic named import: subroute/named
        "
      `);
    });
  });
});
