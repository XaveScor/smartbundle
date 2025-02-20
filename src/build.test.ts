import { describe, expect } from "vitest";
import { run } from "./index.js";
import { $ } from "zx";
import { test } from "vitest-directory-snapshot";
import { disableLog } from "./log.js";
import { errors } from "./errors.js";

disableLog();

describe("build", () => {
  test("simple-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-build",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("es-js-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/es-js-import",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("ts-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/ts-import",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("deep-structure", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/deep-structure",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("simple-bin-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-bin-build",
      command: "build",
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
        command: "build",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("node packages", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/external-deps",
        packagePath: "./node.json",
        command: "build",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });
  });

  test("export-default", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/export-default",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("3-exports-object", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/3-exports-object",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("114-license", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/114-license",
      command: "build",
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
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("43-save-devdeps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/43-save-devdeps",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-deps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-deps",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-subroutes", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-subroutes",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("84-vscode-typings-resolve", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/84-vscode-typings-resolve",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("97-dts-reexports-bundler", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/97-dts-reexports-bundler",
      command: "build",
    });

    expect(res.error).toBeFalsy();

    expect(tmpDir).toMatchDirSnapshot();
  });

  test("99-multi-react-dep", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/99-multi-react-dep",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("101-outDir-ts", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/101-outDir-ts",
      command: "build",
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
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("109-validate-dts-imports", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/109-validate-dts-imports",
      command: "build",
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
      command: "build",
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
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("136-ts-not-installed", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/136-ts-not-installed",
      command: "build",
    });

    expect(res.error).toBeTruthy();
    expect(res.errors[0]).toMatchInlineSnapshot(
      `"smartbundle found the .ts entrypoint but required "typescript" to build .d.ts files. Please install the "typescript" dependency."`,
    );
  });

  test("135-should error when package.json lacks both exports and bin", async ({
    tmpDir,
  }: {
    tmpDir: string;
  }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/no-exports-no-bin",
      command: "build",
    });
    expect(res.error).toBeTruthy();
    expect(res.errors[0]).toBe(errors.exportsRequired);
  });
});

describe("react", () => {
  describe("errors", () => {
    test("jsx", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-jsx-error",
        command: "build",
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
        command: "build",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("modern-jsx/runtime", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-modern-transform",
        command: "build",
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });
  });
});
