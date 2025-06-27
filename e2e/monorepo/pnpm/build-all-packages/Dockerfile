FROM node:22.17.0-alpine3.21

# Install pnpm
RUN npm install -g pnpm@10.11.1

WORKDIR /app
COPY . .

CMD [ "sh", "test.sh" ]
