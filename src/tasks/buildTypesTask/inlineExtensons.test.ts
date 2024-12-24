import { describe, test, expect } from "vitest";
import {
  type FileExists,
  inlineExtensionsCjs,
  inlineExtensionsMjs,
} from "./inlineExtensions.js";
import ts from "typescript";

const exts = [{ ext: ".cjs" }, { ext: ".mjs" }, { ext: ".js" }];

const fileExists: FileExists = (path) => true;
const fileIndexExists: FileExists = (path) => path.includes("index");

describe("inlineExtensionsMjs", () => {
  describe("not changed", () => {
    describe("from file", () => {
      test.each(exts)("reexport all: ${ext}", ({ ext }) => {
        const content = `export * from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named with alias: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs as dirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import default: ${ext}", ({ ext }) => {
        const content = `import resolveDirs from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import named: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import named with alias: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs as dirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import type: ${ext}", ({ ext }) => {
        const content = `import type { Dirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import type with alias: ${ext}", ({ ext }) => {
        const content = `import type { Dirs as Directories } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("dynamic import: ${ext}", ({ ext }) => {
        const content = `await import("./resolveDirs${ext}");\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });
    });

    describe("from lib", () => {
      test("import from lib", () => {
        const content = `import { something } from "test-lib";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test("import type from lib", () => {
        const content = `import type { Something } from "test-lib";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test("dynamic import from lib", () => {
        const content = `await import("test-lib");\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });

      test("export from lib", () => {
        const content = `export { something } from "test-lib";\n`;
        expect(inlineExtensionsMjs(ts, content, fileExists)).toBe(content);
      });
    });
  });

  describe("changed", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";\n`;
      const expected = `export * from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs } from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";\n`;
      const expected = `import resolveDirs from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs } from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";\n`;
      const expected = `import type { Dirs } from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";\n`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");\n`;
      const expected = `await import("./resolveDirs.mjs");\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });

    test("inside generic", () => {
      const input = `Promise<typeof import("./export")>;\n`;
      const expected = `Promise<typeof import("./export.mjs")>;\n`;
      expect(inlineExtensionsMjs(ts, input, fileExists)).toBe(expected);
    });
  });

  describe("changed + index", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";\n`;
      const expected = `export * from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs } from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";\n`;
      const expected = `import resolveDirs from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs } from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";\n`;
      const expected = `import type { Dirs } from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";\n`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");\n`;
      const expected = `await import("./resolveDirs/index.mjs");\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("inside generic", () => {
      const input = `Promise<typeof import("./export")>;\n`;
      const expected = `Promise<typeof import("./export/index.mjs")>;\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });
  });
});

describe("inlineExtensionsCjs", () => {
  describe("not changed", () => {
    describe("from file", () => {
      test.each(exts)("reexport all: ${ext}", ({ ext }) => {
        const content = `export * from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("reexport named with alias: ${ext}", ({ ext }) => {
        const content = `export { resolveDirs as dirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import default: ${ext}", ({ ext }) => {
        const content = `import resolveDirs from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import named: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import named with alias: ${ext}", ({ ext }) => {
        const content = `import { resolveDirs as dirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import type: ${ext}", ({ ext }) => {
        const content = `import type { Dirs } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("import type with alias: ${ext}", ({ ext }) => {
        const content = `import type { Dirs as Directories } from "./resolveDirs${ext}";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test.each(exts)("dynamic import: ${ext}", ({ ext }) => {
        const content = `await import("./resolveDirs${ext}");\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });
    });

    describe("from lib", () => {
      test("import from lib", () => {
        const content = `import { something } from "test-lib";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test("import type from lib", () => {
        const content = `import type { Something } from "test-lib";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test("dynamic import from lib", () => {
        const content = `await import("test-lib");\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });

      test("export from lib", () => {
        const content = `export { something } from "test-lib";\n`;
        expect(inlineExtensionsCjs(ts, content, fileExists)).toBe(content);
      });
    });
  });

  describe("changed", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";\n`;
      const expected = `export * from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs } from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";\n`;
      const expected = `import resolveDirs from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs } from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";\n`;
      const expected = `import type { Dirs } from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";\n`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");\n`;
      const expected = `await import("./resolveDirs.js");\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });

    test("inside generic", () => {
      const input = `Promise<typeof import("./export")>;\n`;
      const expected = `Promise<typeof import("./export.js")>;\n`;
      expect(inlineExtensionsCjs(ts, input, fileExists)).toBe(expected);
    });
  });

  describe("changed + index", () => {
    test("reexport all without extension", () => {
      const input = `export * from "./resolveDirs";\n`;
      const expected = `export * from "./resolveDirs/index.mjs";\n`;
      expect(inlineExtensionsMjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("reexport named without extension", () => {
      const input = `export { resolveDirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs } from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("reexport named with alias without extension", () => {
      const input = `export { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `export { resolveDirs as dirs } from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import default without extension", () => {
      const input = `import resolveDirs from "./resolveDirs";\n`;
      const expected = `import resolveDirs from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import named without extension", () => {
      const input = `import { resolveDirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs } from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import named with alias without extension", () => {
      const input = `import { resolveDirs as dirs } from "./resolveDirs";\n`;
      const expected = `import { resolveDirs as dirs } from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import type without extension", () => {
      const input = `import type { Dirs } from "./resolveDirs";\n`;
      const expected = `import type { Dirs } from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("import type with alias without extension", () => {
      const input = `import type { Dirs as Directories } from "./resolveDirs";\n`;
      const expected = `import type { Dirs as Directories } from "./resolveDirs/index.js";\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("dynamic import without extension", () => {
      const input = `await import("./resolveDirs");\n`;
      const expected = `await import("./resolveDirs/index.js");\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });

    test("inside generic", () => {
      const input = `Promise<typeof import("./export")>;\n`;
      const expected = `Promise<typeof import("./export/index.js")>;\n`;
      expect(inlineExtensionsCjs(ts, input, fileIndexExists)).toBe(expected);
    });
  });
});
