FROM oven/bun:1.2.2-slim AS base

# Install dependencies with cleanup in the same layer to reduce size
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg curl wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
FROM base AS depends
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --production --quiet

# Build the app
FROM depends AS builder
COPY . .
RUN bun run build

# Final production image
FROM base AS runner
WORKDIR /usr/src/app

# Copy only necessary files from the builder
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/drizzle ./drizzle
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000

CMD ["bun", "run", "server.js"]