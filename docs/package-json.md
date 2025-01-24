# Package.json Configuration for SmartBundle

This document outlines the required package.json configuration for SmartBundle and explains the rationale behind each constraint.

## Overview

SmartBundle is a modern JavaScript bundler that enforces strict package.json configurations for reliable builds. Benefits include:

- Consistent ESM-to-CommonJS compatibility.
- Elimination of module resolution ambiguities.
- Prevention of accidental source code publishing.
- Automated generation of package.json for distribution.

This guide explains the required configuration and why certain constraints exist.

- [Overview](#overview)
- [Banned Fields](#banned-fields)
- [SmartBundle-specific Fields](#smartbundle-specific-fields)
- [Exports](#exports)

## Banned Fields

> [!WARNING]
> The following fields must not be included in your source package.json as they conflict with SmartBundle’s automated handling.

### files Field

SmartBundle calculates the import graph automatically and includes all necessary files. Using the 'files' field may result in missed dependencies or an overly bloated package.

### main, module, browser, types Fields

These fields create ambiguity in module resolution. SmartBundle uses only the `exports` field for entry points, and the distributed package.json automatically includes the correct values, ensuring consistent behavior across environments.

## SmartBundle-specific Fields

#### private Field

- Declaration: "private": true  
- Requirement: This field must be set to true to prevent accidental publishing.
- Note: When you run SmartBundle, it generates a new package.json in the output directory containing only the fields needed for publishing.

#### type Field

- Declaration: "type": "module"  
- Requirement: SmartBundle only bundles ESM sources. Setting "type": "module" ensures that Node.js treats your .js files as ES modules, which is mandatory.

#### bin Field

- Declaration Example: 
```json5
{
  "bin": {
    "my-command": "./src/bin.js"
  }
}
```
- Requirement: SmartBundle supports bin specifications (except for `.sh` files). If defined, they are processed to generate executable scripts for your package.
- For more details, see [Node.js package.json bin specification](https://nodejs.org/api/packages.html#bin).

## Exports

The `exports` field defines the package’s entry points for SmartBundle’s ESM-only output. This field is automatically regenerated during bundling. It can be defined using either a simple string path or an object notation for subpath mappings.

### Overview

- Declaration: "exports": "./src/index.js" (or object notation)  
- Requirement: Defines the package entry point(s) that SmartBundle uses.  
- "." key: Denotes the root address of the package.

> [!IMPORTANT]
> The "exports" field defines the entry points—and only the entry points—that SmartBundle uses.  
> During bundling, SmartBundle regenerates this field with the correct values for the output package.

For more information, see the [Node.js Documentation: Package Exports](https://nodejs.org/api/packages.html#exports). Note that SmartBundle currently supports only direct mappings (string paths) in the exports field. Conditional keys such as "import", "require", and glob patterns (e.g. "**") are not supported at this time.

### Simple String Notation

Example – Simple String Notation:
```json5
{
  "exports": "./src/index.js"
}
```

Ensure that your ESM source file follows this format:
```js
// ./src/index.js
export default function greet() {
  console.log('Hello, world!');
}
export function farewell() {
  console.log('Goodbye!');
}
```

Client Usage Examples:
- ESM Import:
```js
import greet, { farewell } from 'your-package';
greet();
farewell();
```
- CommonJS Import:
```js
const pkg = require('your-package');
pkg.default(); // for the default export
pkg.farewell();
```

### Object Notation for Subpath Exports

Example – Object Notation for Subpath Exports:
```json5
{
  "exports": {
    ".": "./src/index.js",
    "./feature": "./src/feature/entrypoint.js"
  }
}
```

Usage Examples:
- Main Import (ESM):
```js
import main from 'your-package';
```
- Feature Import (ESM):
```js
import feature from 'your-package/feature';
```
For CommonJS, access the default export:
```js
const mainPkg = require('your-package');
mainPkg.default();
```

For additional TypeScript-related setup and best practices, please refer to our [TS Guide](./docs/ts-guide.md).
