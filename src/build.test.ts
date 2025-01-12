import { describe, expect } from "vitest";
import { run } from "./index.js";
import { $ } from "zx";
import { test } from "vitest-directory-snapshot";
import { disableLog } from "./log.js";

disableLog();

describe("build", () => {
  test("simple-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("es-js-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/es-js-import",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("ts-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/ts-import",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("deep-structure", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/deep-structure",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("simple-bin-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-bin-build",
    });

    expect(res.error).toBeFalsy();
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
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("node packages", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/external-deps",
        packagePath: "./node.json",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });
  });

  test("export-default", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/export-default",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("3-exports-object", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/3-exports-object",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("114-license", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/114-license",
    });

    expect(res.error).toBeFalsy();
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
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("43-save-devdeps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/43-save-devdeps",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-deps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-deps",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-subroutes", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-subroutes",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("84-vscode-typings-resolve", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/84-vscode-typings-resolve",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("97-dts-reexports-bundler", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/97-dts-reexports-bundler",
    });

    expect(res.error).toBeFalsy();

    expect(tmpDir).toMatchDirSnapshot();
  });

  test("99-multi-react-dep", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/99-multi-react-dep",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("101-outDir-ts", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/101-outDir-ts",
    });

    expect(res.error).toBeFalsy();
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
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("109-validate-dts-imports", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/109-validate-dts-imports",
    });

    expect(res.error).toBeTruthy();
    expect(res.errors[0]).toMatchInlineSnapshot(
      `"The typings won't installed in bundled package: "devDep". Please install them into dependencies or peerDependencies."`,
    );
  });

  test("118-validate-dts-typings-imports", async ({
    tmpDir,
  }: {
    tmpDir: string;
  }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/118-validate-dts-typings-imports",
    });

    expect(res.error).toBeTruthy();
    expect(res.errors[0]).toMatchInlineSnapshot(
      `"The typings won't installed in bundled package: "@types/dep", "@types/importDep", "@types/dynamicDep". Please install them into dependencies or peerDependencies."`,
    );
  });

  test("122-check-types-deps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/122-check-types-deps",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("136-ts-not-installed", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/136-ts-not-installed",
    });

    expect(res.error).toBeTruthy();
    expect(res.errors[0]).toMatchInlineSnapshot(`"smartbundle found the .ts entrypoint but required "typescript" to build .d.ts files. Please install the "typescript" dependency."`);
  });
});

describe("react", () => {
  describe("errors", () => {
    test("jsx", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-jsx-error",
      });

      expect(res.error).toBeTruthy();
      expect(res.errors[0]).toMatchInlineSnapshot(
        `"[smartbundle:react] SmartBundle cannot find the react dependency inside dependencies, optionalDependencies or peerDependencies. Please, install it before bundling"`,
      );
    });
  });

  describe("transform", () => {
    test("legacy-createElement", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-legacy-transform",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("modern-jsx/runtime", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-modern-transform",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });
  });
});
