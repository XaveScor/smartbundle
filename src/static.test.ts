import { describe, expect } from "vitest";
import { run } from "./index.js";
import { test } from "vitest-directory-snapshot";
import { disableLog } from "./log.js";

disableLog();
describe("static files", () => {
  test("readme.md", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/readme-md-copied",
      command: "build",
    });

    expect(res.error).toBeFalsy();
    expect(tmpDir).toMatchDirSnapshot();
  });
});
