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
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("es-js-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/es-js-import",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("ts-import", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/ts-import",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("deep-structure", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/deep-structure",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("simple-bin-build", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/simple-bin-build",
      skipGitignore: true,
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
        skipGitignore: true,
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("node packages", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/external-deps",
        packagePath: "./node.json",
        skipGitignore: true,
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });
  });

  test("export-default", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/export-default",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("3-exports-object", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/3-exports-object",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("114-license", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/114-license",
      skipGitignore: true,
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
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("43-save-devdeps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/43-save-devdeps",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-deps", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-deps",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
  test("37-ignore-subroutes", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/37-ignore-subroutes",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("84-vscode-typings-resolve", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/84-vscode-typings-resolve",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("97-dts-reexports-bundler", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/97-dts-reexports-bundler",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();

    expect(tmpDir).toMatchDirSnapshot();
  });

  test("99-multi-react-dep", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/99-multi-react-dep",
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("101-outDir-ts", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/101-outDir-ts",
      skipGitignore: true,
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
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("109-validate-dts-imports", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/109-validate-dts-imports",
      skipGitignore: true,
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
      skipGitignore: true,
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
      skipGitignore: true,
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("136-ts-not-installed", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/136-ts-not-installed",
      skipGitignore: true,
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
      skipGitignore: true,
    });
    expect(res.error).toBeTruthy();
    expect(res.errors[0]).toBe(errors.exportsRequired);
  });
});

describe("react", () => {
  describe("errors", () => {
    test.skip("jsx", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-jsx-error",
        skipGitignore: true,
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
        skipGitignore: true,
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });

    test("modern-jsx/runtime", async ({ tmpDir }: { tmpDir: string }) => {
      const res = await run({
        outputDir: tmpDir,
        sourceDir: "./src/fixtures/react-modern-transform",
        skipGitignore: true,
      });

      expect(res.error).toBeFalsy();
      expect(tmpDir).toMatchDirSnapshot();
    });
  });
});
