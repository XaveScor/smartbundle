import { describe, expect, test } from "vitest";
import path from "node:path";
import { parseMonorepo } from "./parseMonorepo.js";

// Use real fs operations with fixtures
const FIXTURES_DIR = path.join(__dirname, "__fixtures__");

describe("parseMonorepo", () => {
  describe("Valid pnpm monorepo", () => {
    test("returns project paths for SmartBundle-bundled projects", async () => {
      const validMonorepoDir = path.join(FIXTURES_DIR, "valid-pnpm-monorepo");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: validMonorepoDir,
          packagePath: path.join(validMonorepoDir, "package.json"),
          outDir: path.join(validMonorepoDir, "dist"),
          outBinsDir: path.join(validMonorepoDir, "dist/__bin__"),
          cjsOutDir: path.join(validMonorepoDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(validMonorepoDir, "dist/__compiled__/esm"),
        },
      });

      // Should find the package1-sbsources package but not the regular-package
      expect(result.projectPaths).toHaveLength(1);
      expect(result.projectPaths[0]).toContain("package1-sbsources");
      expect(result.projectPaths.some(p => p.includes("regular-package"))).toBe(false);
    });
  });

  describe("Non-monorepo", () => {
    test("returns empty array for non-monorepo directory", async () => {
      const nonMonorepoDir = path.join(FIXTURES_DIR, "non-monorepo");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: nonMonorepoDir,
          packagePath: path.join(nonMonorepoDir, "package.json"),
          outDir: path.join(nonMonorepoDir, "dist"),
          outBinsDir: path.join(nonMonorepoDir, "dist/__bin__"),
          cjsOutDir: path.join(nonMonorepoDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(nonMonorepoDir, "dist/__compiled__/esm"),
        },
      });

      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Invalid workspace config", () => {
    test("returns empty array for invalid workspace config", async () => {
      const invalidConfigDir = path.join(FIXTURES_DIR, "invalid-workspace-config");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: invalidConfigDir,
          packagePath: path.join(invalidConfigDir, "package.json"),
          outDir: path.join(invalidConfigDir, "dist"),
          outBinsDir: path.join(invalidConfigDir, "dist/__bin__"),
          cjsOutDir: path.join(invalidConfigDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(invalidConfigDir, "dist/__compiled__/esm"),
        },
      });

      expect(result.projectPaths).toEqual([]);
    });
  });
});
