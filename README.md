# SmartBundle

**The Library Bundler That Respects Your Time**

**Table of Contents**  
[Getting Started](#getting-started) • [Features](#features) • [Compatibility](#compatibility) • [Tool Integration](#tool-integration) • [Advanced Usage](#advanced-usage) • [FAQ](#faq)

Build your library for any JavaScript environment without the complexity

## Getting Started

SmartBundle makes it easy to bundle your library for any JavaScript environment. Just create a minimal package.json (see below), install SmartBundle, and run the build command.

```json5
{
  // Your package name
  "name": "my-package",         
  // Package version
  "version": "1.0.0",           
  // Must be true to avoid accidental publishing
  "private": true,              
  // SmartBundle supports only ES modules
  "type": "module",             
  // Entry point used by SmartBundle
  "exports": "./src/index.js",  
  "scripts": {
    // Run this to build your package
    "build": "smartbundle build"      
  }
}
```
> [!TIP]
> Need more details? See our [package.json guide](./docs/package-json.md) for a full explanation of each field. If you plan to use TypeScript, check out our [TS guide](./docs/ts-guide.md) for tailored advice.

To build your package:

1) Create the package.json as shown above
2) Install SmartBundle:
```bash
npm install --save-dev smartbundle@latest
```
3) Build your package:
```bash
npm run build
```
> [!TIP]
> You can learn more about smartbundle modes here [SmartBundle Modes](./docs/modes.md)
4) Your built files (including an auto-generated package.json) will be in the ./dist folder

## Features

- **Zero Configuration**: Simply point to your entry file and let SmartBundle do the rest.

- **Universal Output**: Automatically generates both ESM and CommonJS bundles.

- **TypeScript Ready**: Offers full TypeScript support with up-to-date type definitions.

- **React Support**: Provides automatic JSX transformations with support for both modern and legacy modes.

- **Developer Friendly**: Includes source maps for better debugging of your bundles.

- **Broad Compatibility**: Works seamlessly with Node.js, Webpack, Vite, Rollup, Bun, and more.


## Compatibility

Every bundled package is tested in real environments - from Node.js and Bun to Webpack and Metro - to ensure it just works.

### Runtimes
| Runtime    | Version   | Supported | E2E Tests |
|------------|-----------|:---------:|:---------:|
| Node.js    | ^18.0.0   | ✔        | ✔        |
|            | ^20.0.0   | ✔        | ✔        |
|            | ^22.0.0   | ✔        | ✔        |
|            | ^23.0.0   | ✔        | ✔        |
| Bun        | ^1.0.0    | ✔        | ✔        |
| Deno       | ^2.0.0    | ✔        | -        |

### Bundlers
| Bundler           | Version   | Supported | E2E Tests |
|-------------------|-----------|:---------:|:---------:|
| Webpack           | ^4.47.0   | ✔        | ✔        |
|                   | ^5.95.0   | ✔        | ✔        |
| Rspack           | ^1.0.0    | ✔        | ✔        |
| Vite             | ^5.0.0    | ✔        | -        |
| Rollup           | ^4.0.0    | ✔        | -        |
| Parcel           | ^2.0.0    | ✔        | -        |
| Browserify       | ^17.0.0   | ✔        | -        |
| Esbuild          | ^0.24.0   | ✔        | -        |
| Metro            | ^0.81.0   | ✔        | ✔        |
| Next.js/Turbopack| ^13.0.0   | ✔        | -        |

### TypeScript Module Resolution
| Strategy    | Supported | E2E Tests |
|-------------|:---------:|:---------:|
| bundler     | ✔        | ✔        |
| node10      | ✔        | ✔        |
| node16es    | ✔        | ✔        |
| node16cjs   | ✔        | ✔        |

We aim to support as many bundlers and runtimes as possible. If the bundled package doesn't work with your bundler, please let us know.

## Tool Integration

SmartBundle automatically detects and integrates with your tools—just add what you need to your project.

### TypeScript

Install `typescript@^5.0.0` as a dev dependency and begin writing `.ts` files. SmartBundle handles TypeScript compilation and type definition generation automatically.

### Babel

Install `@babel/core@^7.0.0` as a dev dependency and add a Babel configuration file (usually `babel.config.js`) at the project root. Your transformations will be applied automatically.

### React

Add `react` to your dependencies. SmartBundle will detect React and configure JSX transformations for both modern and legacy modes.

For detailed options regarding React configuration, see our [React guide](./docs/react.md).

## Advanced Usage

SmartBundle follows strict package.json conventions to guarantee reliable builds. For detailed information on required fields, disallowed fields, and configuration best practices, please refer to our [package.json guide](./docs/package-json.md).

## FAQ
### SmartBundle have an issue
Please, look at the [known fixable issues](./docs/issues.md) before creating your own one. Some bugs already have a solution but cannot be fixed without user action.

### Why don't you minify the output?
Minification is typically needed only for production. During development, readable, unminified output helps with debugging.

### Why do you require third-party tools for building?
We prioritize keeping the `node_modules` size manageable and avoid unnecessary dependencies. If your package does not require TypeScript, for instance, you don’t need to install those specific tools.

### Community and Support
If you need assistance or wish to contribute, please check out our [discussion forum](https://github.com/your-org/smartbundle/discussions) and [issue tracker](https://github.com/your-org/smartbundle/issues).
