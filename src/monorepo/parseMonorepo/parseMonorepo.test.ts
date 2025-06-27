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
        sourceDir: validMonorepoDir,
      });

      // Should find the package1-sbsources package but not the regular-package
      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: { "typescript": "^5.0.0" }
      });
      expect(result.projectPaths).toHaveLength(1);
      expect(result.projectPaths[0]).toBe("packages/package1-sbsources");
      expect(result.projectPaths.some(p => p === "packages/regular-package")).toBe(false);
    });
  });

  describe("Multi-glob pnpm monorepo", () => {
    test("returns project paths for SmartBundle-bundled projects from multiple globs", async () => {
      const multiGlobMonorepoDir = path.join(FIXTURES_DIR, "multi-glob-pnpm-monorepo");

      const result = await parseMonorepo({
        sourceDir: multiGlobMonorepoDir,
      });

      // Should find all packages with names ending in -sbsources from all globs
      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toHaveLength(3);

      // Check that packages from each glob are found
      expect(result.projectPaths.some(p => p === "packages/package2-sbsources")).toBe(true);
      expect(result.projectPaths.some(p => p === "apps/package2-sbsources")).toBe(true);
      expect(result.projectPaths.some(p => p === "libs/package2-sbsources")).toBe(true);

      // Check that regular packages are not found
      expect(result.projectPaths.some(p => p === "packages/regular-package2" || p === "apps/regular-package2" || p === "libs/regular-package2")).toBe(false);
    });
  });

  describe("Non-monorepo", () => {
    test("returns empty array for non-monorepo directory", async () => {
      const nonMonorepoDir = path.join(FIXTURES_DIR, "non-monorepo");

      const result = await parseMonorepo({
        sourceDir: nonMonorepoDir,
      });

      expect(result.monorepo).toBe(null);
      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Invalid workspace config", () => {
    test("returns empty array for invalid workspace config", async () => {
      const invalidConfigDir = path.join(FIXTURES_DIR, "invalid-workspace-config");

      const result = await parseMonorepo({
        sourceDir: invalidConfigDir,
      });

      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Missing package.json", () => {
    test("skips directories without package.json", async () => {
      const missingPackageJsonDir = path.join(FIXTURES_DIR, "missing-package-json");

      const result = await parseMonorepo({
        sourceDir: missingPackageJsonDir,
      });

      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Malformed package.json", () => {
    test("skips directories with malformed package.json", async () => {
      const malformedPackageJsonDir = path.join(FIXTURES_DIR, "malformed-package-json");

      const result = await parseMonorepo({
        sourceDir: malformedPackageJsonDir,
      });

      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toEqual([]);
    });
  });

  describe("Case sensitivity", () => {
    test("handles case sensitivity in package name suffix correctly", async () => {
      const caseSensitivityDir = path.join(FIXTURES_DIR, "case-sensitivity");

      const result = await parseMonorepo({
        sourceDir: caseSensitivityDir,
      });

      // Should NOT find the mixed-case-SBSources package because the check is now case-sensitive
      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toHaveLength(0);
    });
  });

  describe("Direct subdirectory pattern", () => {
    test("finds packages in direct subdirectories of the root", async () => {
      const directSubdirDir = path.join(FIXTURES_DIR, "direct-subdir-pnpm-monorepo");

      const result = await parseMonorepo({
        sourceDir: directSubdirDir,
      });

      // Should find the my-app package
      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toHaveLength(1);
      expect(result.projectPaths[0]).toBe("my-app");
    });
  });

  describe("Exclude patterns", () => {
    test("excludes packages in test directories", async () => {
      const excludePatternDir = path.join(FIXTURES_DIR, "exclude-pattern-pnpm-monorepo");

      const result = await parseMonorepo({
        sourceDir: excludePatternDir,
      });

      // Should find the included package but not the excluded test package
      expect(result.monorepo).toEqual({
        type: "pnpm",
        devDeps: {}
      });
      expect(result.projectPaths).toHaveLength(1);
      expect(result.projectPaths[0]).toBe("packages/included-package-sbsources");
      expect(result.projectPaths.some(p => p === "packages/regular-package/test/test-package-sbsources")).toBe(false);
    });
  });

  describe("Missing root package.json", () => {
    test("returns null for monorepo missing root package.json", async () => {
      const missingRootPackageJsonDir = path.join(FIXTURES_DIR, "missing-root-package-json");

      const result = await parseMonorepo({
        sourceDir: missingRootPackageJsonDir,
      });

      // Should return null monorepo because root package.json is missing
      expect(result.monorepo).toBe(null);
      expect(result.projectPaths).toEqual([]);
    });
  });
});
