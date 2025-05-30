FROM node:20.18.0-alpine3.20

WORKDIR /app
RUN npm install -g pnpm
COPY ./package.json ./tsconfig.json ./index.ts ./test.sh ./

VOLUME /test-lib

ENTRYPOINT ["sh", "./test.sh"]