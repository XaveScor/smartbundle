FROM node:22.17.0-alpine3.21

# Install pnpm and set up global directory
RUN npm install -g pnpm@10.11.1 && \
    mkdir -p /root/.local/share/pnpm && \
    pnpm config set global-bin-dir /root/.local/share/pnpm && \
    echo 'export PATH="/root/.local/share/pnpm:$PATH"' >> /root/.bashrc

# Set PNPM_HOME environment variable
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY ./ ./

# Make test.sh executable
RUN chmod +x test.sh

CMD ["./test.sh"]
