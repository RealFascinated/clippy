FROM oven/bun:1.2.2-debian AS base

# Install dependencies
FROM base AS depends
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# # Build the app
# FROM base AS builder
# WORKDIR /usr/src/app
# COPY --from=depends /usr/src/app/node_modules ./node_modules
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED=1

# RUN bun run build

# Run the app
FROM base AS runner
WORKDIR /usr/src/app

COPY . .
COPY --from=depends /usr/src/app/node_modules ./node_modules

ENV NODE_ENV=production

ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000

USER nextjs
CMD ["bun", "run", "start"]
