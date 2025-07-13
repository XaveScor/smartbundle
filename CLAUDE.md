# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartBundle is a zero-configuration library bundler that builds JavaScript/TypeScript packages for any environment. It automatically generates ESM and CommonJS bundles with TypeScript definitions, React support, and Babel transformations.

## Common Commands

### Testing
- `pnpm test` - Run unit tests for src/ directory using Vitest
- `pnpm test:update-snapshots` - Update test snapshots (`pnpm test -- -u`)
- `pnpm test:e2e` - Run end-to-end tests using Docker containers
- `pnpm test:e2e-update-snapshots` - Update e2e test snapshots

### Development
- Use `pnpm` as the package manager (required, specified in engines)
- No lint/typecheck commands defined - check directly with TypeScript compiler if needed

## Architecture

### Core Build Pipeline (`src/index.ts`)
The main build function orchestrates a pipeline of tasks:

1. **Package Analysis** - Parse and validate package.json (`src/packageJson.ts`)
2. **Module Detection** - Identify TypeScript, Babel, React dependencies (`src/detectModules.ts`)
3. **Vite Configuration** - Generate build config with appropriate plugins (`src/createViteConfig.ts`)
4. **Parallel Task Execution** - Run multiple build tasks concurrently:
   - **Static Files** - Copy README, LICENSE, etc. (`src/tasks/copyStaticFilesTask.ts`)
   - **TypeScript Compilation** - Generate .d.ts files (`src/tasks/buildTypesTask/`)
   - **JavaScript Bundling** - Vite build for ESM/CJS (`src/tasks/viteTask.ts`)
   - **Binary Processing** - Handle CLI binaries (`src/tasks/binsTask.ts`)

### Plugin System (`src/plugins/`)
- **Imports Plugin** - Handles external dependency resolution
- **React Plugin** - JSX transformations (modern/legacy modes)
- **Babel Plugin** - Custom Babel transformations when babel.config.js exists

### Monorepo Support (`src/monorepo/`)
- **Detection** - Identify pnpm workspace configurations (`src/monorepo/parseMonorepo/`)
- **Link Packages** - Create reference packages for bundled outputs (`src/monorepo/link.ts`)
- **Binary**: `smartbundle-monorepo-link` - Creates link packages for `-sbsources` suffixed packages

### Entry Points
- **Main CLI**: `src/run.ts` - Handles errors and pretty printing with Youch
- **Library API**: `src/index.ts` - Exports `run()` and `defineViteConfig()` functions
- **Monorepo CLI**: `src/monorepo/link.ts` - Separate binary for monorepo link management

### Testing Strategy
- **Unit Tests** - Test individual functions and components with Vitest
- **Snapshot Tests** - Validate build outputs in `src/__dir_snapshots__/`
- **E2E Tests** - Docker-based tests for different Node.js versions, bundlers (Webpack, Rspack, Metro), and package managers
- **Fixtures** - Test scenarios in `src/fixtures/` cover edge cases and bug reproductions

### Key Design Patterns
- **Task Pipeline** - Uses `src/pipeline.ts` for parallel/sequential task execution
- **Error Handling** - Custom error types (`src/error.ts`, `src/PrettyErrors.ts`) with formatted output
- **Directory Resolution** - Consistent path handling via `src/resolveDirs.ts`
- **Package.json Processing** - Strict validation and transformation for build outputs

### Configuration Files
- `vitest.config.ts` - Uses the same Vite config as the library for consistency
- `tsconfig.json` - TypeScript configuration
- `buildTsconfig.json` - Separate config for building type definitions

## Documentation Files

Read relevant documentation files based on the task at hand:

### Core Documentation
- [`README.md`](./README.md) - Project overview, quick start guide, features, and compatibility matrix. Reference for initial setup and understanding SmartBundle's value proposition.
- [`CLAUDE.md`](./CLAUDE.md) - This file. Instructions for AI assistants working with the codebase.

### Feature-Specific Guides
- [`docs/monorepo.md`](./docs/monorepo.md) - Comprehensive monorepo support guide with pnpm workspaces, `-sbsources` naming convention, and link package system. Essential for monorepo setup and troubleshooting.
- [`docs/package-json.md`](./docs/package-json.md) - Strict package.json requirements including banned fields (files, main, module) and required fields (private: true, type: module). Critical for package configuration.
- [`docs/react.md`](./docs/react.md) - React integration with automatic JSX transformation detection (React < 17 uses createElement, >= 17 uses new runtime). Reference for React library builds.
- [`docs/ts-guide.md`](./docs/ts-guide.md) - TypeScript integration requirements, especially mandatory `verbatimModuleSyntax: true` setting. Essential for TypeScript project setup.

### Troubleshooting
- [`docs/issues.md`](./docs/issues.md) - Known issues documentation, specifically @babel/core installation problems in versions < v0.11.1. Reference when users report issues.

### Development Guidelines
- [`prompts/docs.md`](./prompts/docs.md) - Documentation writing guidelines for consistent SmartBundle documentation with specific structure and GitHub Markdown formatting.
- [`prompts/test.md`](./prompts/test.md) - Testing guidelines using Vitest with vitest-directory-snapshot, fixture structure, and SmartBundle compliance requirements.

### Implementation Details
- [`src/monorepo/README.md`](./src/monorepo/README.md) - Technical documentation for monorepo implementation including re-export system, version control strategy, and troubleshooting. Reference for understanding or extending monorepo functionality.
