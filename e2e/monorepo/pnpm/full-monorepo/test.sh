#!/bin/sh

# Install SmartBundle
pnpm add -D /smartbundle --silent --workspace-root

# Create link packages
pnpm run smartbundle:link --silent

# Install dependencies after link packages are created
pnpm install --silent

# Build all SmartBundle packages
pnpm run -r build --silent

# Test publish (dry run)
pnpm publish -r --access public --dry-run
