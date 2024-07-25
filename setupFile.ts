import { expect } from "vitest";
// @ts-expect-error
import { toMatchDirSnapshot } from "vitest-directory-snapshot";

expect.extend({
  toMatchDirSnapshot,
});
