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
    test(
      "typescript-types",
      async () => {
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
      },
      {
        timeout: 60000,
      },
    );
  });
});
