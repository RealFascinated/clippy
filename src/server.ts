import { createServer } from "http";
import next from "next";
import { parse } from "url";
import TasksManager from "./tasks/tasks-manager";
import { env } from "./lib/env";
import { isProduction } from "./lib/utils/utils";
import Logger from "./lib/logger";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = env.NEXT_PUBLIC_APP_ENV !== "production";
const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
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

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : env.NEXT_PUBLIC_APP_ENV
    }`
  );
});
