FROM node:22.10.0-alpine3.20

WORKDIR /app
COPY ./esm ./esm
COPY ./cjs ./cjs
COPY ./test.sh ./test.sh

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]
