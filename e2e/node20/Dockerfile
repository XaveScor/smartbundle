FROM node:20.19.3-alpine3.21

WORKDIR /app
COPY ./esm ./esm
COPY ./cjs ./cjs
COPY ./test.sh ./test.sh

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]
