import { describe, expect, test } from "vitest";
import { join } from "node:path";
import { parsePackageJson } from "./packageJson.js";
import { errors } from "./errors.js";

describe("parse package.json", () => {
  test("correct", async () => {
    const sourceDir = join(
      import.meta.dirname,
      "fixtures",
      "correct-package-json",
    );
    const packagePath = join(sourceDir, "package.json");

    const packageJson = await parsePackageJson({
      sourceDir,
      packagePath,
    });
    expect(packageJson).not.toStrictEqual(expect.any(Array));
  });

  describe("exports", () => {
    test("required", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.exportsRequired);
    });

    test("should be a string", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-exports",
      );
      const packagePath = join(sourceDir, "non-string-main.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.exportsRequired);
    });

    test("should be a path to a valid file", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-exports",
      );
      const packagePath = join(sourceDir, "file-not-exists.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.exportsInvalid);
    });
  });

  describe("name", () => {
    test("is required", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.nameRequired);
    });

    test("min length", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-name");
      const packagePath = join(sourceDir, "min-length.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.nameMinLength);
    });

    test("max length", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-name");
      const packagePath = join(sourceDir, "max-length.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.nameMaxLength);
    });

    test("no underscore at the beginning", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-name");
      const packagePath = join(sourceDir, "underscore-start.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.nameStartsIllegalChars);
    });

    test("no dot at the beginning", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-name");
      const packagePath = join(sourceDir, "dot-start.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.nameStartsIllegalChars);
    });

    test("is string", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-name");
      const packagePath = join(sourceDir, "not-string.json");

      const packageJson = await parsePackageJson({
        sourceDir,
        packagePath,
      });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.nameRequired);
    });
  });

  describe("version", () => {
    test("is required", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.versionRequired);
    });
  });

  describe("private", () => {
    test("is required", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.privateIsTrue);
    });

    test("is boolean", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-private",
      );
      const packagePath = join(sourceDir, "not-boolean.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.privateIsTrue);
    });

    test("is true", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-private",
      );
      const packagePath = join(sourceDir, "not-true.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.privateIsTrue);
    });
  });

  describe("description", () => {
    test("is string", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-description",
      );
      const packagePath = join(sourceDir, "not-string.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.descriptionString);
    });
  });
});
