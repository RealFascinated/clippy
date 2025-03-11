import Fastify from "fastify";
import nextConfig from "../../next.config";
import { env } from "../lib/env";
import Logger from "../lib/logger";
import { runMigrations } from "../lib/utils/drizzle";
import { thumbnailQueue } from "../queue/queues";
import TasksManager from "../tasks/tasks-manager";
import fastifyNext from "./plugins/fastify-next";
import { FastifyRequest } from "fastify";
import { isProduction } from "@/lib/utils/utils";

// Extend FastifyRequest to include our custom log property
declare module "fastify" {
  interface FastifyRequest {
    customLog?: {
      startTime: [number, number];
    };
  }
}

const port = parseInt(process.env.PORT || "3000", 10);
const dev = env.NEXT_PUBLIC_APP_ENV !== "production";

Logger.info("Starting server...");

// Run migrations
runMigrations().then(async () => {
  const server = Fastify({
    logger: false,
  });

  // Add custom request logging in production
  if (isProduction()) {
    server.addHook("onRequest", (request: FastifyRequest, reply, done) => {
      request.customLog = {
        startTime: process.hrtime(),
      };
      done();
    });

    server.addHook("onResponse", (request: FastifyRequest, reply, done) => {
      if (request.customLog?.startTime) {
        const hrtime = process.hrtime(request.customLog.startTime);
        const timeInMs = (hrtime[0] * 1000 + hrtime[1] / 1e6).toFixed(2);
        Logger.info(
          `${request.method} ${request.url} ${reply.statusCode} in ${timeInMs}ms`
        );
      }
      done();
    });
  }

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
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
});
