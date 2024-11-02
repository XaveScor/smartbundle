FROM node:22.11.0-alpine3.20 as CJS

WORKDIR /app
COPY ./cjs/package.json ./package.json

RUN npm install

FROM node:22.11.0-alpine3.20

WORKDIR /app
COPY ./cjs ./cjs
COPY ./test.sh ./test.sh

COPY --from=CJS /app/node_modules /app/cjs/node_modules

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]
