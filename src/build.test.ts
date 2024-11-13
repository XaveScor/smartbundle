import { describe, expect } from "vitest";
import { run } from "./index.js";
import { $ } from "zx";
// @ts-expect-error
import { test } from "vitest-directory-snapshot";

describe("build", () => {
  test("simple-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-build",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("es-js-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/es-js-import",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("ts-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/ts-import",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("deep-structure", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/deep-structure",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("simple-bin-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-bin-build",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  describe("external-deps", () => {
    test("dependencies", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/external-deps",
        packagePath: "./dependencies.json",
      });

      expect(res.error).toBeFalsy();
      // @ts-expect-error
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("node packages", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/external-deps",
        packagePath: "./node.json",
      });

      expect(res.error).toBeFalsy();
      // @ts-expect-error
      expect(tmpDir).toMatchDirSnapshot();
    });
  });

  test("export-default", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/export-default",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("3-exports-object", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/3-exports-object",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });
});

describe("bugs", () => {
  test("34-deep-structure", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/34-deep-structure",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("43-save-devdeps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/43-save-devdeps",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-deps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-deps",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-subroutes", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-subroutes",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("84-vscode-typings-resolve", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/84-vscode-typings-resolve",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("4-babel-support", async ({ tmpDir }: { tmpDir: string }) => {
    const sourceDir = "./src/fixtures/4-babel-support";

    $.sync`pnpm install --dir ${sourceDir}`;

    const res = await run({
      outputDir: tmpDir,
      sourceDir,
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });
});
