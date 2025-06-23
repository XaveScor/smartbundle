FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY pnpm-workspace.yaml .
COPY package.json .
COPY packages/ ./packages/

# Copy test script
COPY test.sh .
RUN chmod +x test.sh

CMD ["./test.sh"]