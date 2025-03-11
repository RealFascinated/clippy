import express, { Request, Response } from "express";
import next from "next";
import { parse } from "url";
import nextConfig from "../next.config";
import { env } from "./lib/env";
import Logger from "./lib/logger";
import { isProduction } from "./lib/utils/utils";
import { thumbnailQueue } from "./queue/queues";
import TasksManager from "./tasks/tasks-manager";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./lib/db/drizzle";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = env.NEXT_PUBLIC_APP_ENV !== "production";

const app = next({ dev, conf: nextConfig, turbopack: dev, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  Logger.info("Starting server...");

  // Run migrations
  Logger.info("Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  Logger.info("Migrations completed");

  const server = express();

  // Handle all requests through Next.js
  server.all("*", async (req: Request, res: Response) => {
    const parsedUrl = parse(req.url!, true);
    const before = Date.now();

    await handle(req, res);

    // Log requests in production
    if (isProduction()) {
      Logger.info(
        `${req.method} ${parsedUrl.pathname}${parsedUrl.search ?? ""} in ${Date.now() - before}ms`
      );
    }
  });

  server.listen(port, () => {
    new TasksManager();
    thumbnailQueue.loadFiles();

    Logger.info(
      `🚀 Server listening at http://localhost:${port} as ${
        dev ? "development" : env.NEXT_PUBLIC_APP_ENV
      }`
    );
  });
});
