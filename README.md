# SmartBundle
SmartBundle is a zero-config bundler tailored for library authors and package maintainers looking for simplicity and broad compatibility without the need for complex setup.

## Features
`SmartBundle` aims to make the build process seamless and distraction-free. Key features include:
- Configuration-free setup via `package.json`
- Compatibility with popular bundlers and runtimes
- Support for ESM and CJS compatibility
- TypeScript typings generation
- Harmless bin scripts
- Source maps generation for easier debugging

We've also optimized several aspects to ensure the resulting package is as smooth to use as possible.

## How to use
1) Create a `package.json` file like the following:
```json5
{
  "name": "my-package",
  "version": "1.0.0",
  "private": true, // prevents accidental publishing
  "type": "module",
  "exports": "./src/index.ts" // entrypoint for building the package
}
```
2) Run
```bash
npx smartbundle@latest
```
The built files will appear in the `./dist` folder, including an auto-generated `package.json` file.

3) Navigate to the `./dist` folder and publish your package to the npm registry.

## Supported targets
| Target                         | Supported | Covered by e2e tests |
|--------------------------------|-----------|----------------------|
| Bun ^1.0.0                     | ✔         | ✔                    |
| Node ^18.0.0                   | ✔         | ✔                    |
| Node ^20.0.0                   | ✔         | ✔                    |
| Node ^22.0.0                   | ✔         | ✔                    |
| Node ^23.0.0                   | ✔         | ✔                    |
| Webpack ^4.47.0                | ✔         | ✔                    |
| Webpack ^5.95.0                | ✔         | ✔                    |
| Rspack ^1.0.0                  | ✔         | ✔                    |
| Vite ^5.0.0                    | ✔         | not yet              |
| Rollup ^4.0.0                  | ✔         | not yet              |
| Deno ^2.0.0                    | ✔         | not yet              |
| Parcel ^2.0.0                  | ✔         | not yet              |
| Browserify ^17.0.0             | ✔         | not yet              |
| Esbuild ^0.24.0                | ✔         | not yet              |
| Metro ^0.81.0                  | ✔         | ✔                    |
| Next.js/Turbopack ^13.0.0      | ✔         | not yet              |
| TS/ModuleResolution: bundler   | ✔         | ✔                    |
| TS/ModuleResolution: node10    | ✔         | ✔                    |
| TS/ModuleResolution: node16es  | ✔         | ✔                    |
| TS/ModuleResolution: node16cjs | ✔         | ✔                    |

We aim to support as many bundlers and runtimes as possible. If the bundled package doesn't work with your bundler, please let us know.

## Third party tools support
### Typescript
Just install `typescript@^5.0.0` as a dev dependency and start creating ts files.

### Babel
Just install `@babel/core@^7.0.0` as a dev dependency and create a Babel configuration file in the project root.

### React
Just install `react`. More information on React integration can be found [here](./docs/react.md).

## `package.json` limitations
To reduce potential errors and ensure smooth package generation, we follow a stricter configuration for `package.json`.

### Banned fields
#### `files`
SmartBundle calculates the import graph and includes all necessary files, making `files` unnecessary and potentially confusing.
#### `main`, `module`, `browser`, `types`
We rely on the `exports` field for entry points. These fields are redundant and automatically generated in `./dist/package.json`.

### Required fields
#### `private`
Setting `"private": true` avoids accidental publishing of the source package by ensuring it is not mistakenly published to npm.

### Stricter fields
#### `type`
We currently support only the `module` type for packages, with plans to support `commonjs` in future releases.
#### `exports`
Only ESM/TS entry points are currently supported in exports. While [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) are not yet available, they’re planned for an upcoming release.
#### `bin`
Currently, we support all `bin` [specifications](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bin) except for `sh` files. Also, we guarantee that the bin files will execute as expected.

## FAQ
### SmartBundle have an issue
Please, look at the [known fixable issues](./docs/issues.md) before creating your own one. Some bugs already have a solution but cannot be fixed without user action.

### Why don't you minify the output?
Minification is typically needed only for production. During development, readable, unminified output helps with debugging.

### Why do you require third-party tools for building?
We prioritize keeping the `node_modules` size manageable and avoid unnecessary dependencies. If your package does not require TypeScript, for instance, you don’t need to install those specific tools.
