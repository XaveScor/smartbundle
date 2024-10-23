cd /app/esm
npm --silent --prefer-offline install --save /test-lib
npm run build
node ./dist/bundle.js
