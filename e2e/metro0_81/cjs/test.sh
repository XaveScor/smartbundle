cd /app/cjs
npm --silent link /test-lib
npm run build
node ./test.bundle.js
