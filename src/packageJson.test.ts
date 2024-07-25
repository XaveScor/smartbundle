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
    expect(packageJson).toStrictEqual({
      main: "entrypoint.js",
    });
  });

  describe("main", () => {
    test("required", async () => {
      const sourceDir = join(
        import.meta.dirname,
        "fixtures",
        "empty-package-json",
      );
      const packagePath = join(sourceDir, "empty.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.mainRequired);
    });

    test("should be a string", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-main");
      const packagePath = join(sourceDir, "non-string-main.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.mainRequired);
    });

    test("should be a path to a valid file", async () => {
      const sourceDir = join(import.meta.dirname, "fixtures", "incorrect-main");
      const packagePath = join(sourceDir, "file-not-exists.json");

      const packageJson = await parsePackageJson({ sourceDir, packagePath });
      expect(packageJson).toStrictEqual(expect.any(Array));
      expect(packageJson).toContain(errors.mainInvalid);
    });
  });
});
