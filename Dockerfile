FROM oven/bun:1.2.2-slim AS base

# Install minimal dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends -qq curl wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install ALL dependencies for building
FROM base AS builder
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# Copy source and build the app
COPY . .
RUN bun run build

# Install ONLY production dependencies
FROM base AS prod-deps
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --production --quiet

# Final production image
FROM base AS runner
WORKDIR /usr/src/app

# Download and extract static FFmpeg build
RUN mkdir -p /usr/local/bin && \
    curl -sL https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar -xJ --strip-components=1 -C /usr/local/bin ffmpeg-*-static/ffmpeg && \
    chmod +x /usr/local/bin/ffmpeg

# Copy only the production dependencies
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules

# Copy build artifacts and other necessary files
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/drizzle ./drizzle
COPY --from=builder /usr/src/app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /usr/src/app/package.json ./

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000

CMD ["bun", "server.js"]