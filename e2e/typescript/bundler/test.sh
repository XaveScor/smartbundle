#!/bin/sh

# Link the test library
pnpm link /test-lib --silent

# Install dependencies
pnpm install --silent

# Run TypeScript type checking
pnpm run --silent test-types