import { test as base } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const test = base.extend<{ tmpDir: string }>({
  tmpDir: async ({}, use) => {
    const dir = await mkdtemp(join(tmpdir(), "smartbundle-test-"));
    await use(dir);
    await rm(dir, { recursive: true, force: true });
  },
});
