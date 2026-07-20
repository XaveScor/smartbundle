import { describe, expect, test, vi } from "vitest";
import { PrettyError } from "../PrettyErrors.js";
import { runBuildCommand } from "./build.js";

describe("runBuildCommand", () => {
  test("passes only canonical build options to run", async () => {
    const runBuild = vi.fn(async () => ({ error: false as const }));

    expect(
      await runBuildCommand(
        {
          _: ["build"],
          $0: "smartbundle",
          sourceDir: "src",
          s: "src",
          packagePath: "package.json",
          p: "package.json",
          outputDir: "out",
          o: "out",
          seq: true,
          help: false,
          h: false,
        } as never,
        { runBuild },
      ),
    ).toBe(0);
    expect(runBuild).toHaveBeenCalledWith({
      sourceDir: "src",
      packagePath: "package.json",
      outputDir: "out",
      seq: true,
    });
  });

  test("passes an empty option set without parser metadata", async () => {
    const runBuild = vi.fn(async () => ({ error: false as const }));

    await runBuildCommand({} as never, { runBuild });

    expect(runBuild).toHaveBeenCalledWith({
      sourceDir: undefined,
      packagePath: undefined,
      outputDir: undefined,
      seq: undefined,
    });
  });

  test("prints regular and pretty build errors and returns 1", async () => {
    const output: string[] = [];
    const runBuild = vi.fn(async () => ({
      error: true as const,
      errors: ["plain failure", new PrettyError("pretty failure")],
    }));

    expect(
      await runBuildCommand({} as never, {
        runBuild,
        writeError: (text) => output.push(text),
      }),
    ).toBe(1);
    expect(output[0]).toBe("\x1b[31m[ERROR] plain failure \x1b[0m");
    expect(output[1]).toContain("pretty failure");
  });
});
