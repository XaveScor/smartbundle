#!/bin/sh
set -e

cd /smartbundle
npm install --silent --production

cd /app
npm install -g /smartbundle

smartbundle-monorepo-link > /dev/null 2>&1

pnpm install > /dev/null 2>&1
pnpm run check-types
