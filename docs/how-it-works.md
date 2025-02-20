# How It Works

## Overview
SmartBundle processes your project in two phases. First, it reads the source `package.json` (which may have `"type": "module"` and selectively defined fields). Then, it generates a new `package.json` for distribution that is optimized for both ESM and CommonJS usage.

## Transformation Process
- **Input Parsing:** Validates the user's original `package.json`.
- **Output Generation:** Produces a new version used for bundling and publishing.
- **Field Adjustments:**
    - Input packages are expected to be ESM (`"type": "module"`).
    - The output package may include `"type": "commonjs"` with additional fields such as `"main"` and `"module"`.
    - These transformations ensure cross-environment compatibility.

## Understanding the Mismatches
The apparent mismatches between documentation and build output occur because:
- The docs describe the source configuration.
- The build system intentionally transforms the source configuration to generate a production-ready package.
- This two-phase approach guarantees reliable bundling.

## Examples

**Input package.json (source):**
```json
{
  "name": "my-package",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": "./src/index.js"
}
```

**Generated package.json (output):**
```json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "commonjs",
  "main": "./__compiled__/cjs/index.js",
  "module": "./__compiled__/esm/index.mjs",
  "exports": {
    ".": {
      "require": {
        "default": "./__compiled__/cjs/index.js",
        "types": "./__compiled__/cjs/index.d.ts"
      },
      "import": {
        "default": "./__compiled__/esm/index.mjs",
        "types": "./__compiled__/esm/index.d.ts"
      }
    }
  }
}
```

For further details, see the [Package.json Guide](./package-json.md) and the [Modes Documentation](./modes.md).
