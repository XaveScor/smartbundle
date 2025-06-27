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
      const testDirPath = path.resolve(
        import.meta.dirname,
        "typescript",
        "node10",
      );
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`""`);
    });

    test("bundler", async () => {
      const testDirPath = path.resolve(
        import.meta.dirname,
        "typescript",
        "bundler",
      );
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`""`);
    });

    test("node16cjs", async () => {
      const testDirPath = path.resolve(
        import.meta.dirname,
        "typescript",
        "node16cjs",
      );
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`""`);
    });

    test("node16es", async () => {
      const testDirPath = path.resolve(
        import.meta.dirname,
        "typescript",
        "node16es",
      );
      const dockerHash = buildBaseImage(testDirPath);

      expect(
        $.sync`docker run -v ${testLibDir}:/test-lib ${dockerHash}`.text(),
      ).toMatchInlineSnapshot(`""`);
    });
  });
});
