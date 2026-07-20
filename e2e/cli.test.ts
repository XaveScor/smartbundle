import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect } from "vitest";
import { test } from "../src/test-utils.js";

const bin = resolve("dist/__bin__/smartbundle.js");

function execute(cwd: string, ...args: string[]) {
  const result = spawnSync(process.execPath, [bin, ...args], {
    cwd,
    encoding: "utf8",
  });
  if (result.error) {
    throw result.error;
  }
  return result;
}

describe("built CLI", () => {
  test("bare invocation does not build", async ({ tmpDir }) => {
    await writeFile(
      join(tmpDir, "package.json"),
      JSON.stringify({
        name: "bare-cli-test",
        private: true,
        type: "module",
        exports: "./index.js",
      }),
    );
    await writeFile(join(tmpDir, "index.js"), "export const value = 1;\n");

    const result = execute(tmpDir);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("No build was performed");
    expect(result.stdout).toContain("smartbundle [command]");
    expect(result.stderr).toBe("");
    expect(existsSync(join(tmpDir, "dist"))).toBe(false);
  });

  test.each([["--help"], ["build", "--help"], ["skill", "--help"]])(
    "prints contextual help for %j",
    async (...args) => {
      const result = execute(process.cwd(), ...args);

      expect(result.status).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toMatch(
        args[0] === "build"
          ? /^smartbundle build \[options\]/
          : args[0] === "skill"
            ? /^smartbundle skill/
            : /^smartbundle \[command\]/,
      );
      expect(result.stdout).toContain(
        "smartbundle skill` for machine-readable",
      );
    },
  );

  test.each([
    ["--unknown"],
    ["unknown"],
    ["build", "--unknown"],
    ["build", "extra"],
    ["skill", "--unknown"],
    ["skill", "extra"],
  ])("returns status 1 for invalid invocation %j %j", async (...args) => {
    const result = execute(process.cwd(), ...args);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Unknown");
    expect(result.stderr.match(/Unknown (?:command|argument):/g)).toHaveLength(
      1,
    );
  });

  test("prints the skill from the built package byte for byte", async () => {
    const expected = await readFile(resolve("dist/skills/SKILL.md"), "utf8");
    const result = execute(process.cwd(), "skill");

    expect(result.status).toBe(0);
    expect(result.stdout).toBe(expected);
    expect(result.stderr).toBe("");
  });

  test("builds a package through the build command", async ({ tmpDir }) => {
    const outDir = join(tmpDir, "output");
    const result = execute(
      tmpDir,
      "build",
      "--sourceDir",
      resolve("src/fixtures/simple-build"),
      "--outputDir",
      outDir,
    );

    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(join(outDir, "package.json"))).toBe(true);
  });

  test("returns status 1 when the build fails", async ({ tmpDir }) => {
    await mkdir(join(tmpDir, "project"));
    await writeFile(join(tmpDir, "project/package.json"), "{}");

    const result = execute(tmpDir, "build", "--sourceDir", "project");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("[ERROR]");
  });
});
