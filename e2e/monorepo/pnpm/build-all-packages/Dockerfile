FROM node:22.11.0-alpine

# Install pnpm
RUN npm install -g pnpm@10.11.1

WORKDIR /app
COPY . .

CMD [ "sh", "test.sh" ]