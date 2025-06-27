FROM node:22.17.0-alpine3.21

# Install git and pnpm for gitignore testing
RUN apk add --no-cache git
RUN npm install -g pnpm

WORKDIR /app
COPY ./test.sh ./test.sh

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]
