#!/bin/sh
set -e

cd /smartbundle
npm install --silent --production
npm install --silent -g /smartbundle

cd /app

smartbundle-monorepo-link > /dev/null 2>&1
npm uninstall --silent -g smartbundle

pnpm install > /dev/null 2>&1
pnpm build

# Check that both packages were built
echo "Checking utils package build..."
if [ ! -f "packages/utils/sb-dist/index.mjs" ]; then
  echo "ERROR: utils package was not built"
  exit 1
fi

echo "Checking logger package build..."
if [ ! -f "packages/logger/sb-dist/index.mjs" ]; then
  echo "ERROR: logger package was not built"
  exit 1
fi

# Test that the built packages work
echo "Testing utils package..."
cd packages/utils
node -e "
import { MESSAGE, greet, add } from './sb-dist/index.mjs';
console.log('utils:', MESSAGE);
console.log('greet:', greet('World'));
console.log('add:', add(2, 3));
"

echo "Testing logger package..."
cd ../logger
node -e "
import { log, error, VERSION } from './sb-dist/index.mjs';
log('Test message');
error('Test error');
console.log('version:', VERSION);
"

echo "Monorepo build test completed successfully!"
