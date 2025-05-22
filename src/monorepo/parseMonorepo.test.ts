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

  describe("Multi-glob pnpm monorepo", () => {
    test("returns project paths for SmartBundle-bundled projects from multiple globs", async () => {
      const multiGlobMonorepoDir = path.join(FIXTURES_DIR, "multi-glob-pnpm-monorepo");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: multiGlobMonorepoDir,
          packagePath: path.join(multiGlobMonorepoDir, "package.json"),
          outDir: path.join(multiGlobMonorepoDir, "dist"),
          outBinsDir: path.join(multiGlobMonorepoDir, "dist/__bin__"),
          cjsOutDir: path.join(multiGlobMonorepoDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(multiGlobMonorepoDir, "dist/__compiled__/esm"),
        },
      });

      // Should find all packages with names ending in -sbsources from all globs
      expect(result.projectPaths).toHaveLength(3);

      // Check that packages from each glob are found
      expect(result.projectPaths.some(p => p.includes("packages/package2-sbsources"))).toBe(true);
      expect(result.projectPaths.some(p => p.includes("apps/package2-sbsources"))).toBe(true);
      expect(result.projectPaths.some(p => p.includes("libs/package2-sbsources"))).toBe(true);

      // Check that regular packages are not found
      expect(result.projectPaths.some(p => p.includes("regular-package2"))).toBe(false);
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

  describe("Missing package.json", () => {
    test("skips directories without package.json", async () => {
      const missingPackageJsonDir = path.join(FIXTURES_DIR, "missing-package-json");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: missingPackageJsonDir,
          packagePath: path.join(missingPackageJsonDir, "package.json"),
          outDir: path.join(missingPackageJsonDir, "dist"),
          outBinsDir: path.join(missingPackageJsonDir, "dist/__bin__"),
          cjsOutDir: path.join(missingPackageJsonDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(missingPackageJsonDir, "dist/__compiled__/esm"),
        },
      });

      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Malformed package.json", () => {
    test("skips directories with malformed package.json", async () => {
      const malformedPackageJsonDir = path.join(FIXTURES_DIR, "malformed-package-json");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: malformedPackageJsonDir,
          packagePath: path.join(malformedPackageJsonDir, "package.json"),
          outDir: path.join(malformedPackageJsonDir, "dist"),
          outBinsDir: path.join(malformedPackageJsonDir, "dist/__bin__"),
          cjsOutDir: path.join(malformedPackageJsonDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(malformedPackageJsonDir, "dist/__compiled__/esm"),
        },
      });

      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Case sensitivity", () => {
    test("handles case sensitivity in package name suffix correctly", async () => {
      const caseSensitivityDir = path.join(FIXTURES_DIR, "case-sensitivity");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: caseSensitivityDir,
          packagePath: path.join(caseSensitivityDir, "package.json"),
          outDir: path.join(caseSensitivityDir, "dist"),
          outBinsDir: path.join(caseSensitivityDir, "dist/__bin__"),
          cjsOutDir: path.join(caseSensitivityDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(caseSensitivityDir, "dist/__compiled__/esm"),
        },
      });

      // Should NOT find the mixed-case-SBSources package because the check is now case-sensitive
      expect(result.projectPaths).toHaveLength(0);
    });
  });

  describe("Direct subdirectory pattern", () => {
    test("finds packages in direct subdirectories of the root", async () => {
      const directSubdirDir = path.join(FIXTURES_DIR, "direct-subdir-pnpm-monorepo");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: directSubdirDir,
          packagePath: path.join(directSubdirDir, "package.json"),
          outDir: path.join(directSubdirDir, "dist"),
          outBinsDir: path.join(directSubdirDir, "dist/__bin__"),
          cjsOutDir: path.join(directSubdirDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(directSubdirDir, "dist/__compiled__/esm"),
        },
      });

      // Should find the my-app package
      expect(result.projectPaths).toHaveLength(1);
      expect(result.projectPaths[0]).toContain("my-app");
    });
  });

  describe("Exclude patterns", () => {
    test("excludes packages in test directories", async () => {
      const excludePatternDir = path.join(FIXTURES_DIR, "exclude-pattern-pnpm-monorepo");

      const result = await parseMonorepo({
        dirs: {
          sourceDir: excludePatternDir,
          packagePath: path.join(excludePatternDir, "package.json"),
          outDir: path.join(excludePatternDir, "dist"),
          outBinsDir: path.join(excludePatternDir, "dist/__bin__"),
          cjsOutDir: path.join(excludePatternDir, "dist/__compiled__/cjs"),
          esmOutDir: path.join(excludePatternDir, "dist/__compiled__/esm"),
        },
      });

      // Should find the included package but not the excluded test package
      expect(result.projectPaths).toHaveLength(1);
      expect(result.projectPaths[0]).toContain("included-package-sbsources");
      expect(result.projectPaths.some(p => p.includes("test-package-sbsources"))).toBe(false);
    });
  });
});
