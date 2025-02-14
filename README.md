# SmartBundle

<div align="center">
  <h3>The Library Bundler That Respects Your Time</h3>

  <p>
    <a href="#getting-started">Getting Started</a> •
    <a href="#features">Features</a> •
    <a href="#compatibility">Compatibility</a> •
    <a href="#tool-integration">Tool Integration</a> •
    <a href="#advanced-usage">Advanced Usage</a> •
    <a href="#faq">FAQ</a>
  </p>
</div>

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

### Steps to Build Your Package:
1. **Create your package.json** using the template above.

2. **Install SmartBundle:**

   ```bash
   npm install --save-dev smartbundle@latest
   ```

3. **Build your package** with either:

   ```bash
   npm run build
   # or
   npx smartbundle
   # or explicitly
   npx smartbundle build
   ```
> [!TIP]
> Learn more about different [SmartBundle Modes](./docs/modes.md).

4. **Find your built files** (including an auto-generated package.json) in the `./dist` folder.

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
### I Encounter an Issue with SmartBundle
Before reporting a new issue, please check the [known fixable issues](./docs/issues.md) as some bugs might already have a solution that requires a small adjustment.

### Why isn’t the output minified?
Minification is generally applied only in production. During development, readable (unminified) output is provided to facilitate debugging.

### Why are third-party tools required for building?
This approach keeps the `node_modules` footprint manageable. For example, if your package doesn’t require TypeScript, you can skip installing its dependencies.

### Community and Support
If you need assistance or wish to contribute, please check out our [discussion forum](https://github.com/your-org/smartbundle/discussions) and [issue tracker](https://github.com/your-org/smartbundle/issues).
