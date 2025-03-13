import { createServer } from "http";
import { parse } from "url";
import next from "next";
import nextConfig from "../../next.config";
import { thumbnailQueue } from "@/queue/queues";
import TasksManager from "@/tasks/tasks-manager";
import { runMigrations } from "@/lib/utils/drizzle";
import chalk from "chalk";
import { networkInterfaces } from "os";
import { env } from "@/lib/env";
import Logger from "@/lib/logger";
import { getResponseTimeColor, getStatusColor } from "@/lib/utils/log-colors";
import { isProduction } from "@/lib/utils/utils";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = !isProduction();
const app = next({ dev, conf: nextConfig, turbopack: dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (request, response) => {
    const parsedUrl = parse(request.url!, true);

    const before = performance.now();

    await handle(request, response, parsedUrl);

    const after = performance.now();
    const timeInMs = (after - before).toFixed(2);
    const timeInMsNum = parseFloat(timeInMs);

    if (isProduction()) {
      Logger.info(
        `${chalk.bold(request.method)} ${request.url} ${getStatusColor(response.statusCode)(response.statusCode)} in ${getResponseTimeColor(timeInMsNum)(timeInMs)}ms`
      );
    }
  }).listen(port);

  server.on("listening", async () => {
    await runMigrations();

    new TasksManager();
    thumbnailQueue.loadFiles();
  });

  const localIP = getLocalIP();
  const startupTime = new Date().toLocaleTimeString();

  console.log("\n" + "=".repeat(50));
  console.log(chalk.bold.green("🚀 Server Successfully Started!"));
  console.log("=".repeat(50));
  console.log(chalk.cyan("📡 Network Information:"));
  console.log(`   ${chalk.bold("Local:")}           http://localhost:${port}`);
  console.log(`   ${chalk.bold("On Your Network:")} http://${localIP}:${port}`);
  console.log("\n📊 Server Details:");
  console.log(
    `   ${chalk.bold("Environment:")}     ${env.NEXT_PUBLIC_APP_ENV ?? "development"}`
  );
  console.log(`   ${chalk.bold("Log Level:")}       ${env.LOG_LEVEL}`);
  console.log(`   ${chalk.bold("Start Time:")}      ${startupTime}`);
  console.log(`   ${chalk.bold("Node.js Version:")} ${process.version}`);
  console.log(`   ${chalk.bold("Bun Version:")}     v${Bun.version}`);
  console.log("=".repeat(50) + "\n");
});

// import { isProduction } from "@/lib/utils/utils";
// import multipart from "@fastify/multipart";
// import chalk from "chalk";
// import Fastify, {
//   FastifyReply,
//   FastifyRequest,
//   HookHandlerDoneFunction,
// } from "fastify";
// import { networkInterfaces } from "os";
// import nextConfig from "../../next.config";
// import { env } from "../lib/env";
// import Logger from "../lib/logger";
// import { runMigrations } from "../lib/utils/drizzle";
// import { getResponseTimeColor, getStatusColor } from "../lib/utils/log-colors";
// import { thumbnailQueue } from "../queue/queues";
// import TasksManager from "../tasks/tasks-manager";
// import fastifyNext from "./plugins/fastify-next";

// // Extend FastifyRequest to include our custom log property
// declare module "fastify" {
//   interface FastifyRequest {
//     customLog?: {
//       startTime: [number, number];
//     };
//   }
// }

// const port = parseInt(process.env.PORT || "3000", 10);
// const dev = env.NEXT_PUBLIC_APP_ENV !== "production";

// Logger.info("Starting server...");

// // Run migrations
// runMigrations().then(async () => {
//   const server = Fastify({
//     logger: false,
//   });

//   // Register multipart plugin to handle form-data
//   await server.register(multipart);

//   // Add custom request logging in production
//   if (isProduction()) {
//     server.addHook(
//       "onRequest",
//       (request: FastifyRequest, _, done: HookHandlerDoneFunction) => {
//         request.customLog = {
//           startTime: process.hrtime(),
//         };
//         done();
//       }
//     );

//     server.addHook(
//       "onResponse",
//       (
//         request: FastifyRequest,
//         reply: FastifyReply,
//         done: HookHandlerDoneFunction
//       ) => {
//         if (request.customLog?.startTime && !request.url.startsWith("/_next")) {
//           const hrtime = process.hrtime(request.customLog.startTime);
//           const timeInMs = (hrtime[0] * 1000 + hrtime[1] / 1e6).toFixed(2);
//           const timeInMsNum = parseFloat(timeInMs);

// Logger.info(
//   `${chalk.bold(request.method)} ${request.url} ${getStatusColor(reply.statusCode)(reply.statusCode)} ${getResponseTimeColor(timeInMsNum)(`in ${timeInMs}ms`)}`
// );
//         }
//         done();
//       }
//     );
//   }

//   // Register Next.js plugin
//   await server.register(fastifyNext, {
// dev,
// conf: nextConfig,
// turbopack: dev,
// port,
//   });

//   // Handle routes with Next.js
//   server.next("*", [
//     "GET",
//     "HEAD",
//     "POST",
//     "PUT",
//     "DELETE",
//     "OPTIONS",
//     "PATCH",
//   ]);

//   try {
//     await server.listen({ port, host: "0.0.0.0" });

// new TasksManager();
// thumbnailQueue.loadFiles();

//     // Get startup information
//     const localIP = getLocalIP();
//     const startupTime = new Date().toLocaleTimeString();
//     const environment = dev ? "development" : "production";

//     // Create a visually appealing startup message
// console.log("\n" + "=".repeat(50));
// console.log(chalk.bold.green("🚀 Server Successfully Started!"));
// console.log("=".repeat(50));
// console.log(chalk.cyan("📡 Network Information:"));
// console.log(
//   `   ${chalk.bold("Local:")}           http://localhost:${port}`
// );
// console.log(
//   `   ${chalk.bold("On Your Network:")} http://${localIP}:${port}`
// );
// console.log("\n📊 Server Details:");
// console.log(`   ${chalk.bold("Environment:")}     ${environment}`);
// console.log(`   ${chalk.bold("Log Level:")}       ${env.LOG_LEVEL}`);
// console.log(`   ${chalk.bold("Start Time:")}      ${startupTime}`);
// console.log(`   ${chalk.bold("Node.js Version:")} ${process.version}`);
// console.log(`   ${chalk.bold("Bun Version:")}     v${Bun.version}`);
// console.log("=".repeat(50) + "\n");
//   } catch (err) {
//     Logger.error("Failed to start server:", err);
//     process.exit(1);
//   }
// });

// // Get local IP address
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
