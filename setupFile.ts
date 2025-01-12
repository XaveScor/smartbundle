import { expect } from "vitest";
import { toMatchDirSnapshot } from "vitest-directory-snapshot";

expect.extend({
  toMatchDirSnapshot,
});
