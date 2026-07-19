import { describe, expect, test } from "vitest";
import { isCodeExport } from "./exports.js";

describe("isCodeExport", () => {
  test.each(["index.js", "index.mjs", "index.jsx", "index.ts", "index.tsx"])(
    "treats %s as code",
    (filePath) => expect(isCodeExport(filePath)).toBe(true),
  );

  test.each([
    "SKILL.md",
    "schema.json",
    "styles.css",
    "module.wasm",
    "LICENSE",
  ])("treats %s as raw", (filePath) =>
    expect(isCodeExport(filePath)).toBe(false),
  );
});
