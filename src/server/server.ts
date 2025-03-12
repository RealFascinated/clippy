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
import multipart from "@fastify/multipart";
import { networkInterfaces } from "os";
import chalk from "chalk";
import { getStatusColor, getResponseTimeColor } from "../lib/utils/log-colors";

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

  // Register multipart plugin to handle form-data
  await server.register(multipart);

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
        const timeInMsNum = parseFloat(timeInMs);

        Logger.info(
          `${chalk.bold(request.method)} ${request.url} ${getStatusColor(reply.statusCode)(reply.statusCode)} ${getResponseTimeColor(timeInMsNum)(`in ${timeInMs}ms`)}`
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

    // Get startup information
    const localIP = getLocalIP();
    const startupTime = new Date().toLocaleTimeString();
    const environment = dev ? "development" : "production";

    // Create a visually appealing startup message
    console.log("\n" + "=".repeat(50));
    console.log(chalk.bold.green("🚀 Server Successfully Started!"));
    console.log("=".repeat(50));
    console.log(chalk.cyan("📡 Network Information:"));
    console.log(
      `   ${chalk.bold("Local:")}           http://localhost:${port}`
    );
    console.log(
      `   ${chalk.bold("On Your Network:")} http://${localIP}:${port}`
    );
    console.log("\n📊 Server Details:");
    console.log(`   ${chalk.bold("Environment:")}     ${environment}`);
    console.log(`   ${chalk.bold("Start Time:")}      ${startupTime}`);
    console.log(`   ${chalk.bold("Node.js Version:")} ${process.version}`);
    console.log("=".repeat(50) + "\n");
  } catch (err) {
    Logger.error("Failed to start server:", err);
    process.exit(1);
  }
});

// Get local IP address
const getLocalIP = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      // Skip internal and non-IPv4 addresses
      if (!net.internal && net.family === "IPv4") {
        return net.address;
      }
    }
  }
  return "unknown";
};
