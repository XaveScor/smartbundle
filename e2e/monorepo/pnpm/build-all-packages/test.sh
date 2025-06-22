#!/bin/sh
set -e

cd /smartbundle
npm install --silent --production
npm install -g /smartbundle

cd /app

smartbundle-monorepo-link
pnpm install
smartbundle

# Check that both packages were built
echo "Checking utils package build..."
if [ ! -f "packages/utils-sbsources/dist/index.mjs" ]; then
  echo "ERROR: utils package was not built"
  exit 1
fi

echo "Checking logger package build..."
if [ ! -f "packages/logger-sbsources/dist/index.mjs" ]; then
  echo "ERROR: logger package was not built"
  exit 1
fi

# Test that the built packages work
echo "Testing utils package..."
cd packages/utils-sbsources
node -e "
import { MESSAGE, greet, add } from './dist/index.mjs';
console.log('utils:', MESSAGE);
console.log('greet:', greet('World'));
console.log('add:', add(2, 3));
"

echo "Testing logger package..."
cd ../logger-sbsources
node -e "
import { log, error, VERSION } from './dist/index.mjs';
log('Test message');
error('Test error');
console.log('version:', VERSION);
"

echo "Monorepo build test completed successfully!"
