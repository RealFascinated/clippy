import Fastify from "fastify";
import nextConfig from "../../next.config";
import { env } from "../lib/env";
import Logger from "../lib/logger";
import { runMigrations } from "../lib/utils/drizzle";
import { thumbnailQueue } from "../queue/queues";
import TasksManager from "../tasks/tasks-manager";
import fastifyNext from "./plugins/fastify-next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = env.NEXT_PUBLIC_APP_ENV !== "production";

Logger.info("Starting server...");

// Run migrations
runMigrations().then(async () => {
  const server = Fastify();

  // Register Next.js plugin
  await server.register(fastifyNext, {
    dev,
    conf: nextConfig,
    turbopack: dev,
    port,
  });

  // Handle routes with Next.js
  server.next("*", [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
  ]);

  try {
    await server.listen({ port, host: "0.0.0.0" });

    new TasksManager();
    thumbnailQueue.loadFiles();

    Logger.info(
      `🚀 Server listening at http://localhost:${port} as ${
        dev ? "development" : env.NEXT_PUBLIC_APP_ENV
      }`
    );
  } catch (err) {
    Logger.error("Failed to start server:", err);
    process.exit(1);
  }
});
