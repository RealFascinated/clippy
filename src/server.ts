import { createServer } from "http";
import next from "next";
import { parse } from "url";
import { env } from "./lib/env";
import Logger from "./lib/logger";
import { isProduction } from "./lib/utils/utils";
import { thumbnailQueue } from "./queue/queues";
import TasksManager from "./tasks/tasks-manager";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = env.NEXT_PUBLIC_APP_ENV !== "production";

const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  Logger.info("Starting server...");

  createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    const before = Date.now();
    await handle(req, res, parsedUrl);

    // Log requests in production
    if (isProduction()) {
      Logger.info(
        `${req.method} ${parsedUrl.pathname}${parsedUrl.search ?? ""} in ${Date.now() - before}ms`
      );
    }
  }).listen(port);

  new TasksManager();
  thumbnailQueue.loadFiles();

  Logger.info(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : env.NEXT_PUBLIC_APP_ENV
    }`
  );
});
