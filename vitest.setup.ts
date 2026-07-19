import { expect } from "vitest";
import { createToMatchDirSnapshot } from "vitest-directory-snapshot";

expect.extend({
  toMatchDirSnapshot: createToMatchDirSnapshot({
    snapshotDirectoryName: "__dir_snapshots__",
  }),
});
