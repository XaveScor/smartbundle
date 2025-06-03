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
});
