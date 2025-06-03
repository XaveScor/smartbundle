# Monorepo Support in SmartBundle

## Overview

The monorepo support in SmartBundle allows the library to work seamlessly within pnpm workspace environments. It provides a mechanism to create "link packages" that reference the source code during development while still allowing proper bundling for distribution.

## The Problem

In a monorepo setup, packages often need to reference each other during development. However, when using a bundler like SmartBundle, you want to:

1. Work with the original source files during development (for hot reloading, debugging, etc.)
2. Bundle and distribute optimized packages for production
3. Avoid manually managing multiple package.json files for the same package

## Prerequisites

SmartBundle monorepo support requires:
- A pnpm workspace configuration (`pnpm-workspace.yaml`)
- Package.json files with names ending in `-sbsources` for packages that need bundling
- The workspace configuration should include both source packages and their dist directories:
  ```yaml
  packages:
    - 'packages/*'
    - 'packages/*/dist'
  ```

## The Solution: `-sbsources` Convention

SmartBundle introduces a naming convention where packages with names ending in `-sbsources` (in their package.json) are treated as source packages that need to be bundled. The monorepo link system then creates corresponding "link packages" (without the suffix) that:

- Point to the source package during development
- Get replaced with bundled output during the build process
- Maintain proper package.json exports for both scenarios

## How It Works

### 1. Package Structure

**Important**: The `-sbsources` suffix is in the package name (inside package.json), NOT in the folder name.

```
packages/
  my-package/               # Regular folder name (no suffix)
    src/
      index.ts
    package.json            # Contains "name": "my-package-sbsources"
    dist/                   # Link package directory (auto-generated)
      package.json          # Contains "name": "my-package" (without suffix)
```

Example package.json in the source directory:
```json
{
  "name": "my-package-sbsources",  // Note: suffix is here, not in folder
  "version": "1.0.0",
  "exports": "./src/index.ts"
}
```

### 2. The Link Process

The `smartbundle-monorepo-link` command:

1. **Scans** the workspace for packages with names ending in `-sbsources` (checks package.json files)
2. **Creates** a `dist/` directory inside each matching package directory
3. **Generates** a minimal package.json in the `dist/` directory that:
   - Has the name without the `-sbsources` suffix
   - Includes the version from the source package
   - Adds a devDependency on the source package using `workspace:*`
   - Creates a wire between source and dist for pnpm workspace resolution

### 3. Build Integration

When SmartBundle builds a `-sbsources` package:
- Output goes to `__compiled__/` directory within the source package
- TypeScript definitions are generated
- Both ESM and CJS formats are created
- The built package.json is placed in the output directory with proper exports pointing to the compiled files

## Implementation Details

### Key Components

- **`parseMonorepo.ts`** - Detects and parses pnpm workspace configurations
- **`createLinkPackages.ts`** - Generates link packages for `-sbsources` packages
- **`convertPackageJson.ts`** - Transforms package.json for link packages
- **`link.ts`** - CLI entry point for the monorepo link command

### Package.json Transformation

The monorepo link process creates two types of package.json files:

1. **Link Package** (in `dist/` directory during development):
   - Minimal package.json with name (without `-sbsources`), version, and description
   - Contains `devDependencies` pointing to the source package: `"package-sbsources": "workspace:*"`
   - Creates a pnpm workspace link between the source and dist packages

2. **Built Package** (created by SmartBundle during build):
   - Full package.json with all necessary fields
   - Name without the `-sbsources` suffix
   - Proper exports pointing to the compiled output in `__compiled__/`
   - All dependencies with `-sbsources` suffixes are renamed to their dist names

### Edge Cases Handled

- Packages without exports in the source package.json
- Binary executables (bin field)
- TypeScript type definitions
- Nested export paths (e.g., `./sub-path`)
- Folder names don't need to match package names (only the package.json name matters)

## Benefits

1. **Development Experience** - Work directly with source files
2. **Build Optimization** - Automatic bundling without manual configuration
3. **Type Safety** - TypeScript definitions are properly generated and linked
4. **Monorepo Compatible** - Works with pnpm workspaces out of the box
5. **Zero Configuration** - No need to manually manage link packages

## Usage

In a monorepo root:
```bash
smartbundle-monorepo-link
```

This command should be run:
- After adding new `-sbsources` packages
- As part of the postinstall script
- Before building packages that depend on `-sbsources` packages

## Workflow

1. **Development Phase**:
   - Work on source code in `packages/my-package/` (with `"name": "my-package-sbsources"` in package.json)
   - Run `smartbundle-monorepo-link` to create `dist/` directories with link packages
   - Other packages can import from `my-package` (which pnpm resolves to the dist directory)

2. **Build Phase**:
   - Run `smartbundle` on the `-sbsources` package
   - Creates `__compiled__/` directory with bundled ESM/CJS output
   - Generates a complete package.json in the output directory
   - The output directory becomes the publishable package

3. **Publishing**:
   - The contents of the output directory (with transformed package.json) are published to npm
   - Consumers install the package without the `-sbsources` suffix