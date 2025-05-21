
# SmartBundle Monorepo Support Guide

<!-- Table of Contents -->
- [Overview](#overview)
- [Supported Package Managers](#supported-package-managers)
- [How SmartBundle Supports Monorepos](#how-smartbundle-supports-monorepos)
    - [SmartBundle-bundled Packages](#smartbundle-bundled-packages)
    - [Link Packages](#link-packages)
- [Usage](#usage)
    - [Commands](#commands)
    - [Workflow](#workflow)
- [Typical Release Pipeline](#typical-release-pipeline)

## Overview

This guide explains how SmartBundle supports monorepo projects, allowing you to efficiently manage multiple packages in a single repository while maintaining proper dependency relationships between bundled and non-bundled packages.

SmartBundle provides specialized tooling for monorepos that creates link packages for bundled components, enabling seamless integration within your dependency tree.

## Supported Package Managers

> [!IMPORTANT]
> Currently, SmartBundle officially supports only **pnpm** for monorepo projects. Support for npm and yarn is planned for future releases.

We recommend using pnpm due to its efficient handling of dependencies in monorepo environments.

## How SmartBundle Supports Monorepos

### SmartBundle-bundled Packages

SmartBundle identifies packages intended for bundling through a specific naming convention:

- Package names that end with `-sbsources` are recognized as SmartBundle-bundled packages
- Example: `@my-company/my-package-sbsources`
- The `-sbsources` suffix is automatically removed after bundling

### Link Packages

SmartBundle creates "link packages" to ensure proper dependency resolution within your monorepo:

- A link package is a reference package that points to the bundled output
- It allows other packages to depend on the bundled version rather than the source version
- This enables correct dependency resolution in the dependency tree

Example monorepo structure:
```
--packages
 |--a                  // name: "a"
 |--b-sbsources        // name: "b-sbsources"
   |--dist             // linked package here named "b"
```

After running `smartbundle-monorepo-link`, package `a` can depend on package `b` (the bundled output) instead of `b-sbsources` (the source code).

## Usage

### Commands

SmartBundle provides a dedicated command for monorepo linking:

```bash
smartbundle-monorepo-link
```

This command:
1. Identifies all packages with the `-sbsources` suffix
2. Creates link packages for each one
3. Updates the dependency tree to use the correct references

> [!WARNING]
> You must run `smartbundle-monorepo-link && pnpm install` after any package.json editing to ensure proper dependency resolution.

### Workflow

The typical workflow for a SmartBundle monorepo project:

1. Create your packages, using the `-sbsources` suffix for packages that need bundling
2. Run `smartbundle-monorepo-link` to create link packages
3. Run `pnpm install` to update dependencies
4. Run `smartbundle` to bundle all packages with the `-sbsources` suffix
5. Build any remaining packages as needed

## Typical Release Pipeline

For CI/CD and release processes, follow this sequence:

```bash
# Install dependencies
pnpm install

# Verify link packages are up-to-date (fails if updates needed)
smartbundle-monorepo-link --ci

# Bundle all SmartBundle-bundled packages
smartbundle

# Build other packages
pnpm build

# Publish packages
pnpm publish
```

This pipeline ensures all dependencies are properly linked and bundled before publishing.

### Community and Support
If you need assistance or wish to contribute, please check out our [discussion forum](https://github.com/your-org/smartbundle/discussions) and [issue tracker](https://github.com/your-org/smartbundle/issues).
