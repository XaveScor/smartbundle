#!/bin/bash
set -e

echo "Testing build tool validation failure..."

# Install dependencies  
pnpm install

# Try to build with monorepo command - this should fail
echo "Running smartbundle monorepo build (should fail)..."
if /smartbundle/bin/smartbundle-monorepo; then
  echo "ERROR: Build should have failed but succeeded!"
  exit 1
else
  echo "✅ Build correctly failed with validation error"
fi

echo "Build tool validation test completed successfully!"