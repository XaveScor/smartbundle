FROM node:22.11.0-alpine3.20 as ESM

WORKDIR /app
COPY ./esm/package.json ./package.json

RUN npm install

FROM node:22.11.0-alpine3.20 as CJS

WORKDIR /app
COPY ./cjs/package.json ./package.json

RUN npm install

FROM node:22.11.0-alpine3.20

WORKDIR /app
COPY ./esm ./esm
COPY ./cjs ./cjs
COPY ./test.sh ./test.sh

COPY --from=ESM /app/node_modules /app/esm/node_modules
COPY --from=CJS /app/node_modules /app/cjs/node_modules

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]
