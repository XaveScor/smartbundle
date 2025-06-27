import { describe, expect, vi } from "vitest";
import { createLinkPackages } from "./createLinkPackages.js";
import { test } from "vitest-directory-snapshot";
import { disableLog } from "../../log.js";
import fs from "node:fs/promises";

disableLog();

// Mock console.log and console.error to avoid cluttering test output
const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("createLinkPackages", () => {
  test("simple-monorepo", async ({ tmpDir }: { tmpDir: string }) => {
    // Copy fixture to tmpDir so we can modify it
    await fs.cp(
      "./src/monorepo/createLinkPackages/__fixtures__/simple-monorepo",
      tmpDir,
      { recursive: true },
    );

    await createLinkPackages({
      sourceDir: tmpDir,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Created link package for lib-sbsources"),
    );
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("multi-package-monorepo", async ({ tmpDir }: { tmpDir: string }) => {
    // Copy fixture to tmpDir so we can modify it
    await fs.cp(
      "./src/monorepo/createLinkPackages/__fixtures__/multi-package-monorepo",
      tmpDir,
      { recursive: true },
    );

    await createLinkPackages({
      sourceDir: tmpDir,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Created link package for first-sbsources"),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Created link package for second-sbsources"),
    );
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("empty-monorepo", async ({ tmpDir }: { tmpDir: string }) => {
    // Copy fixture to tmpDir so we can modify it
    await fs.cp(
      "./src/monorepo/createLinkPackages/__fixtures__/empty-monorepo",
      tmpDir,
      { recursive: true },
    );

    await createLinkPackages({
      sourceDir: tmpDir,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "No SmartBundle-bundled projects found in the monorepo",
    );
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("reexports-test", async ({ tmpDir }: { tmpDir: string }) => {
    // Copy fixture to tmpDir so we can modify it
    await fs.cp(
      "./src/monorepo/createLinkPackages/__fixtures__/reexports-test",
      tmpDir,
      { recursive: true },
    );

    await createLinkPackages({
      sourceDir: tmpDir,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Created link package for @test/utils-sbsources"),
    );
    expect(tmpDir).toMatchDirSnapshot();
  });

  test("removes-existing-sb-dist", async ({ tmpDir }: { tmpDir: string }) => {
    await fs.cp(
      "./src/monorepo/createLinkPackages/__fixtures__/sb-dist-removal",
      tmpDir,
      { recursive: true },
    );

    const sbDistPath = `${tmpDir}/packages/my-package/sb-dist`;

    // Verify the old files exist before running createLinkPackages
    const filesBefore = await fs.readdir(sbDistPath);
    expect(filesBefore).toContain("old-file.js");
    expect(filesBefore).toContain("__compiled__");

    await createLinkPackages({
      sourceDir: tmpDir,
    });

    // Verify the old files were removed
    const filesAfter = await fs.readdir(sbDistPath);
    expect(filesAfter).not.toContain("old-file.js");
    expect(filesAfter).not.toContain("__compiled__");

    expect(tmpDir).toMatchDirSnapshot();
  });
});
