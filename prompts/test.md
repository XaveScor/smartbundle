# Base Prompt for Creating Tests

## Compliance with SmartBundle Guidelines
Ensure that all tests and fixture projects comply with SmartBundle's rules as described in the docs. In particular:
  - Each fixture's package.json must include `"private": true` and `"type": "module"` and **must not** include banned fields such as `files`, `main`, `module`, `browser`, or `types`.
  - For TypeScript fixtures, ensure the tsconfig.json has `"verbatimModuleSyntax": true`.
  - Do not disable logging in tests.

## Overview
You are an expert test writer using Vitest along with the "vitest-directory-snapshot" package. Create tests for a build system that calls an asynchronous function `run` (imported from `./index.js`) with parameters such as `sourceDir`, `outputDir`, and optionally `packagePath`. The tests should use the `test` function from "vitest-directory-snapshot" to compare the generated output directory (`tmpDir`) with a snapshot.

## Test Guidelines

1. **Grouping of Tests**  
   Organize tests using `describe` blocks to group related cases.

2. **Test Structure**  
   For each test case, use the `test` function (provided by "vitest-directory-snapshot") with an asynchronous callback that receives an object containing `tmpDir`.
   *Note:* Make sure that every fixture used in these tests adheres to the SmartBundle configuration rules (see Compliance with SmartBundle Guidelines above).

3. **Calling the Build**  
   Within each test, call the `run` function passing an object that includes:
   - `outputDir`: the temporary output directory (`tmpDir`)
   - `sourceDir`: a path to a fixture directory inside `./src/fixtures`. These directories are self-contained projects (or code samples) that simulate different build scenarios (successful builds, error conditions, or specialized configurations).
   - Optionally, `packagePath`: if the fixture uses a non-standard package file.
   *Note:* The build's output (including any generated package.json modifications) must respect SmartBundle's guidelines detailed in the documentation.

4. **Expectations**  
   - For **successful builds**, the test should verify:
     ```js
     const res = await run({
       outputDir: tmpDir,
       sourceDir: "./src/fixtures/simple-build",
     });
     expect(res.error).toBeFalsy();
     expect(tmpDir).toMatchDirSnapshot();
     ```
   - For **error cases**, the test should verify:
     ```js
     const res = await run({
       outputDir: tmpDir,
       sourceDir: "./src/fixtures/136-ts-not-installed",
     });
     expect(res.error).toBeTruthy();
     expect(res.errors[0]).toMatchInlineSnapshot(
       `"smartbundle found the .ts entrypoint but required \"typescript\" to build .d.ts files. Please install the \"typescript\" dependency."`
     );
     ```

5. **Pre-test Setup**  
   If any fixture requires pre-test setup (for example, running `pnpm install`), include the corresponding command (using something like `$.sync`) before invoking `run`.

## Fixtures Folder Structure

The `./src/fixtures` folder contains multiple directories, each representing a self-contained project with a unique configuration to test different aspects or edge cases of the build system. For example:
- **simple-build**: Tests a basic build process.
- **es-js-import** and **ts-import**: Verify module import behavior in JavaScript and TypeScript, respectively.
- **136-ts-not-installed**: Simulates an error scenario (e.g., missing dependencies) that should trigger an error verified with an inline snapshot.
- Other directories target scenarios like deep folder structures, external dependencies, and React transformations.

## Conclusion

Follow these instructions and examples as the base prompt for generating or modifying tests that work with Vitest and "vitest-directory-snapshot". Remember to adhere to all SmartBundle guidelines and do not include any instructions to disable logging in your tests.
