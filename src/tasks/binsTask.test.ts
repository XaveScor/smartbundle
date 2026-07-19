import { expect } from "vitest";
import { join } from "node:path";
import { stat } from "node:fs/promises";
import { test } from "../test-utils.js";
import { BuildError } from "../error.js";
import { binsTask } from "./binsTask.js";

test("fails when a bin output chunk is missing", async ({ tmpDir }) => {
  await expect(
    binsTask({
      buildOutput: [],
      bins: new Map([["cli", join(tmpDir, "source", "cli.ts")]]),
      outBinsDir: join(tmpDir, "__bin__"),
      outDir: tmpDir,
    }),
  ).rejects.toEqual(new BuildError("Cannot find output chunks for bins: cli"));
});

test("writes executable bin wrappers", async ({ tmpDir }) => {
  const source = join(tmpDir, "source", "cli.ts");
  const outBinsDir = join(tmpDir, "__bin__");

  await binsTask({
    buildOutput: [
      {
        facadeModuleId: source,
        fileName: "__compiled__/esm/cli.mjs",
      } as never,
    ],
    bins: new Map([["cli", source]]),
    outBinsDir,
    outDir: tmpDir,
  });

  const mode = (await stat(join(outBinsDir, "cli.js"))).mode & 0o777;
  expect(mode).toBe(0o755);
});
