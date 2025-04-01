FROM node:22.11.0-alpine3.20

WORKDIR /app
RUN npm install -g pnpm
COPY ./packages ./package.json ./pnpm-workspace.yaml ./test.sh ./

VOLUME /smartbundle

ENTRYPOINT ["sh", "./test.sh"]
