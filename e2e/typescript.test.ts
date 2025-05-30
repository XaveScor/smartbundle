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

describe("typescript e2e", () => {
  let testLibDir = "";
  beforeAll(async () => {
    testLibDir = await fs.mkdtemp(path.join(tmpdir(), "smartbundle-test-lib"));
    await run({
      sourceDir: path.resolve(import.meta.dirname, "test-lib"),
      outputDir: testLibDir,
    });
  });

  describe("moduleResolution", () => {
    test("node10", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "typescript", "node10");
      await prepareTestDir(testDirPath);
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`""`);
    });

    test("bundler", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "typescript", "bundler");
      await prepareTestDir(testDirPath);
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`""`);
    });

    test("node16cjs", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "typescript", "node16cjs");
      await prepareTestDir(testDirPath);
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`""`);
    });

    test("node16es", async () => {
      const testDirPath = path.resolve(import.meta.dirname, "typescript", "node16es");
      await prepareTestDir(testDirPath);
      const dockerHash = buildBaseImage(testDirPath);

      expect($.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text())
        .toMatchInlineSnapshot(`""`);
    });
  });
});