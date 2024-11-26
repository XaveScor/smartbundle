import { describe, test, expect } from "vitest";
import {
  type FileExists,
  inlineExtensionsCjs,
  inlineExtensionsMjs,
} from "./inlineExtensions.js";

const exts = [{ ext: ".cjs" }, { ext: ".mjs" }, { ext: ".js" }];

const fileExists: FileExists = (path) => true;
const fileIndexExists: FileExists = (path) => path.includes("index");

describe("inlineExtensionsMjs", () => {
  describe("not changed", () => {
    describe("from file", () => {
      test.each(exts)("reexport all: ${ext}", ({ ext }) => {
        const content = `export * from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named with alias: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs as dirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import default: ${ext}", ({ ext }) => {
        const content = `import resolveDirs from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import named: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import named with alias: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs as dirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import type: ${ext}", ({ ext }) => {
        const content = `import type { Dirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import type with alias: ${ext}", ({ ext }) => {
        const content = `import type { Dirs as Directories } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("dynamic import: ${ext}", ({ ext }) => {
        const content = `await import("./resolveDirs${ext}");`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });
    });

    describe("from lib", () => {
      test("import from lib", () => {
        const content = `import { something } from "test-lib";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test("import type from lib", () => {
        const content = `import type { Something } from "test-lib";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test("dynamic import from lib", () => {
        const content = `await import("test-lib");`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });

      test("export from lib", () => {
        const content = `export { something } from "test-lib";`;
        expect(inlineExtensionsMjs(content, fileExists)).toBe(content);
      });
    });
  });

  describe("changed", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";`;
      const expected = `export * from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs } from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";`;
      const expected = `import resolveDirs from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs } from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";`;
      const expected = `import type { Dirs } from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs.mjs";`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");`;
      const expected = `await import("./resolveDirs.mjs");`;
      expect(inlineExtensionsMjs(input, fileExists)).toBe(expected);
    });
  });

  describe("changed + index", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";`;
      const expected = `export * from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs } from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";`;
      const expected = `import resolveDirs from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs } from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";`;
      const expected = `import type { Dirs } from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");`;
      const expected = `await import("./resolveDirs/index.mjs");`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });
  });
});

describe("inlineExtensionsCjs", () => {
  describe("not changed", () => {
    describe("from file", () => {
      test.each(exts)("reexport all: ${ext}", ({ ext }) => {
        const content = `export * from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named with alias: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs as dirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import default: ${ext}", ({ ext }) => {
        const content = `import resolveDirs from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import named: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import named with alias: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs as dirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import type: ${ext}", ({ ext }) => {
        const content = `import type { Dirs } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("import type with alias: ${ext}", ({ ext }) => {
        const content = `import type { Dirs as Directories } from "./resolveDirs${ext}";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test.each(exts)("dynamic import: ${ext}", ({ ext }) => {
        const content = `await import("./resolveDirs${ext}");`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });
    });

    describe("from lib", () => {
      test("import from lib", () => {
        const content = `import { something } from "test-lib";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test("import type from lib", () => {
        const content = `import type { Something } from "test-lib";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test("dynamic import from lib", () => {
        const content = `await import("test-lib");`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });

      test("export from lib", () => {
        const content = `export { something } from "test-lib";`;
        expect(inlineExtensionsCjs(content, fileExists)).toBe(content);
      });
    });
  });

  describe("changed", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";`;
      const expected = `export * from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs } from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";`;
      const expected = `import resolveDirs from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs } from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";`;
      const expected = `import type { Dirs } from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs.js";`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");`;
      const expected = `await import("./resolveDirs.js");`;
      expect(inlineExtensionsCjs(input, fileExists)).toBe(expected);
    });
  });

  describe("changed + index", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";`;
      const expected = `export * from "./resolveDirs/index.mjs";`;
      expect(inlineExtensionsMjs(input, fileIndexExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs } from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";`;
      const expected = `import resolveDirs from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs } from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";`;
      const expected = `import type { Dirs } from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs/index.js";`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");`;
      const expected = `await import("./resolveDirs/index.js");`;
      expect(inlineExtensionsCjs(input, fileIndexExists)).toBe(expected);
    });
  });
});
