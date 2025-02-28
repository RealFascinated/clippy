FROM oven/bun:1.2.2-slim AS base

# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends -qq curl wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Build stage
FROM base AS builder
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# Copy source and build the app
COPY . .
RUN bun run build

# Production dependencies stage
FROM base AS prod-deps
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --production --quiet

# Final smaller image with Alpine
FROM oven/bun:1.2.2-alpine AS runner
WORKDIR /usr/src/app

# Install curl and wget in Alpine
RUN apk add --no-cache curl wget ca-certificates

# Copy only the ffmpeg binary from alpine version
COPY --from=mwader/static-ffmpeg:7.1-alpine /ffmpeg /usr/local/bin/

# Copy only the production dependencies
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules

# Copy only necessary build artifacts
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/.next/server ./.next/server
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/drizzle ./drizzle
COPY --from=builder /usr/src/app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /usr/src/app/package.json ./

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000

CMD ["bun", "server.js"]