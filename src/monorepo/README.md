# Monorepo Support in SmartBundle

## Overview

SmartBundle provides seamless monorepo support for pnpm workspaces, enabling efficient development and bundling of TypeScript/JavaScript packages. It solves the fundamental challenge of working with source files during development while distributing optimized bundles for production.

## The Core Problem

In monorepo development, we face conflicting requirements:

1. **Development needs**:
   - Direct source file editing with hot reloading
   - TypeScript type checking without compilation
   - Fast iteration cycles

2. **Production needs**:
   - Optimized, bundled code
   - Dual format support (ESM/CJS)
   - Proper dependency resolution

Traditional approaches force you to choose between development experience and production optimization. SmartBundle solves this with its link package system.

## How It Works

### The `-sbsources` Convention

SmartBundle uses a naming convention to identify packages that need bundling:

- **Source packages**: Named with `-sbsources` suffix (e.g., `my-package-sbsources`)
- **Link packages**: Automatically generated without suffix (e.g., `my-package`)
- **Folder names**: Can be anything - only the package.json name matters

### Package Structure

```
packages/
  my-lib/                      # Folder name (can be anything)
    src/
      index.ts                 # Source code
      utils.ts
    package.json               # name: "@company/my-lib-sbsources"
    dist/                      # Auto-generated link package
      package.json             # name: "@company/my-lib"
      index.ts                 # Re-exports from source
      utils.ts                 # Re-exports from source
```

### The Link Package System

Link packages serve as a stable interface between development and production:

1. **During Development**:
   - Link packages contain re-export files
   - Re-exports import from the `-sbsources` package
   - TypeScript resolves types directly from source
   - Changes are immediately reflected

2. **After Build**:
   - SmartBundle compiles source to `__compiled__/`
   - Generates proper package.json with exports
   - Creates both ESM and CJS formats
   - Ready for npm publishing

## Why This Design?

### Why `-sbsources` Suffix?

The suffix is essential for several reasons:

1. **Package Identification**: Clearly marks which packages need bundling in mixed monorepos
2. **Unique Names**: pnpm requires unique package names in workspaces
3. **Source Preservation**: Prevents build output from overwriting source files
4. **Developer Clarity**: Explicit distinction between source and consumable packages

### Why Re-exports?

Re-exports solve the entry point mismatch problem:

```typescript
// Source package.json
"exports": "./src/index.ts"

// Built package.json
"exports": "./__compiled__/esm/index.mjs"
```

Without re-exports, consumers would need different import paths for development vs production. Re-exports provide consistent entry points that work in both scenarios.

## Setup and Configuration

### Prerequisites

1. **pnpm workspace** with `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'packages/*'
     - 'packages/*/dist'  # Include link packages
   ```

2. **Source packages** with `-sbsources` suffix in package.json

### Commands

```bash
# Create/update link packages
smartbundle-monorepo-link

# Build all -sbsources packages
smartbundle

# CI validation (fails if links are outdated)
smartbundle-monorepo-link --ci
```

### Workflow

1. **Initial Setup**:
   ```bash
   # Create your source package
   mkdir packages/my-lib
   echo '{"name": "@company/my-lib-sbsources"}' > packages/my-lib/package.json
   
   # Generate link packages
   smartbundle-monorepo-link
   
   # Install dependencies
   pnpm install
   ```

2. **Development**:
   - Edit source files directly
   - Other packages import from `@company/my-lib`
   - TypeScript and hot reloading work seamlessly

3. **Build & Publish**:
   ```bash
   # Build all packages
   smartbundle
   
   # Publish (from output directory)
   cd packages/my-lib/dist
   npm publish
   ```

## Implementation Details

### Key Files

- **`parseMonorepo.ts`**: Finds packages with `-sbsources` suffix
- **`createLinkPackages.ts`**: Generates link packages with re-exports
- **`convertPackageJson.ts`**: Transforms package.json for output
- **`link.ts`**: CLI command implementation

### Re-export Example

Source: `packages/my-lib/src/index.ts`
```typescript
export const hello = () => "Hello from source!";
```

Link: `packages/my-lib/dist/index.ts`
```typescript
export * from "@company/my-lib-sbsources";
```

Consumer: `packages/app/index.ts`
```typescript
import { hello } from "@company/my-lib";  // Works in dev & prod
```

### Edge Cases Handled

- Multiple export paths (`./utils`, `./components`, etc.)
- Binary executables (bin field)
- TypeScript declaration files
- Dependencies with `-sbsources` suffix (automatically renamed)
- Packages without explicit exports

## Benefits

1. **Zero Configuration**: No complex build configs needed
2. **Fast Development**: Work directly with TypeScript source
3. **Production Ready**: Automatic dual-format bundling
4. **Type Safety**: Full TypeScript support throughout
5. **Monorepo Native**: Designed for pnpm workspaces

## Common Patterns

### React Component Library
```json
{
  "name": "@company/ui-sbsources",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/Button.tsx",
    "./form": "./src/Form.tsx"
  }
}
```

### Shared Utilities
```json
{
  "name": "@company/utils-sbsources",
  "exports": "./src/index.ts",
  "dependencies": {
    "@company/types-sbsources": "workspace:*"
  }
}
```

### CLI Tool
```json
{
  "name": "@company/cli-sbsources",
  "bin": {
    "my-cli": "./src/cli.ts"
  }
}
```

## Troubleshooting

### "No SmartBundle-bundled projects found"
- Check that package.json names end with `-sbsources`
- Verify pnpm-workspace.yaml includes your packages

### TypeScript can't find types
- Run `smartbundle-monorepo-link` after package changes
- Ensure `pnpm install` was run after linking

### Build fails with "module not found"
- Check that dependencies use the non-suffixed names
- Verify link packages were created in dist/ directories