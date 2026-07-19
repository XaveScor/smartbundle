import { expect, test } from "vitest";
import { promiseSettledResultErrors } from "./promiseSettledResultErrors.js";

test("flattens rejected reasons from nested task results", () => {
  const first = new Error("first");
  const results = [
    { status: "rejected", reason: first },
    [
      { status: "fulfilled", value: undefined },
      { status: "rejected", reason: "second" },
    ],
  ] as const;

  expect(promiseSettledResultErrors(results)).toEqual([first, "second"]);
});
