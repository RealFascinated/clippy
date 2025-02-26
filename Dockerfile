FROM oven/bun:1.2.2-debian AS base

# Install dependencies
RUN apt-get update && apt-get install -y ffmpeg curl wget --quiet

# Install dependencies
FROM base AS depends
WORKDIR /usr/src/app
COPY package.json* bun.lock* ./
RUN bun install --frozen-lockfile --quiet

# Run the app
FROM base AS runner
WORKDIR /usr/src/app

COPY . .
COPY --from=depends /usr/src/app/node_modules ./node_modules

RUN bun run build

ENV NODE_ENV=production

ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
ENV PORT=3000

CMD ["bun", "run", "start"]
