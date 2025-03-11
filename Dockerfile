FROM oven/bun:1.2.5-slim AS base

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# Copy source and build the app
COPY . .
RUN bun run build \
    && rm -rf node_modules \
    && bun install --frozen-lockfile --production --quiet \
    && rm -rf .git .github .next/cache/* \
           src/.next/cache/* \
           **/*.map \
           !cli/**/*.map \
           **/*.ts \
           !**/*.d.ts \
           !cli/**/*.ts \
           **/*.tsx \
           !.next/types/**/*.ts \
           !.next/types/**/*.tsx

# Final smaller image
FROM oven/bun:1.2.5-alpine
WORKDIR /app

# Install binutils for strip command and copy/strip ffmpeg
COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /usr/local/bin/

# Copy only necessary build artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/cli ./cli
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production \
    NEXT_PUBLIC_APP_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=3000

EXPOSE 3000

CMD ["bun", "run", "start"]