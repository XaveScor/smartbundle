import { expect, test } from "vitest";
import { value } from "./index.js";

test("runs", () => {
  expect(value).toBe(42);
});
