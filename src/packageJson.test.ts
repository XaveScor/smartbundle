import { describe, expect, test } from "vitest";
import { join } from "node:path";
import { parsePackageJson } from "./packageJson.js";
import { errors } from "./errors.js";
import { disableLog } from "./log.js";

disableLog();
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
    test("is optional", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).not.toContain(errors.exportsRequired);
    });

    test("should valid type", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-exports",
      );
      const packagePath = join(sourceDir, "invalid-exports-type.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.exportsRequired);
    });

    test("can be an object", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-exports",
      );
      const packagePath = join(sourceDir, "file-in-object-not-exists.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.exportsInvalid);
    });

    test("can be a path", async () => {
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

  describe("dependencies", () => {
    test("is object", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-dependencies",
      );
      const packagePath = join(sourceDir, "not-object.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.dependenciesInvalid);
    });

    test("is optional", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).not.toContain(errors.dependenciesInvalid);
    });

    test("not Object<string, string>", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "incorrect-dependencies",
      );
      const packagePath = join(sourceDir, "not-str-str.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.dependenciesInvalid);
    });
  });

  describe("bin", () => {
    test("is string", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-bin");
      const packagePath = join(sourceDir, "not-string.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.binFiled);
    });

    test("is optional", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).not.toContain(errors.binFiled);
    });
  });
});
