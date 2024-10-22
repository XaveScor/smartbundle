FROM oven/bun:1.1.31-alpine

WORKDIR /app
COPY ./esm ./esm
COPY ./cjs ./cjs
COPY ./test.sh ./test.sh

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]
