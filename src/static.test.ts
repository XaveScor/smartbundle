import { describe, expect } from "vitest";
import { run } from "./index.js";
// @ts-expect-error
import { test } from "vitest-directory-snapshot";

describe("static files", () => {
  test("readme.md", async ({ tmpDir }: { tmpDir: string }) => {
    const res = await run({
      outputDir: tmpDir,
      sourceDir: "./src/fixtures/readme-md-copied",
    });

    expect(res.error).toBeFalsy();
    // @ts-expect-error
    expect(tmpDir).toMatchDirSnapshot();
  });
});
