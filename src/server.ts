import { createServer } from "http";
import next from "next";
import { parse } from "url";
import TasksManager from "./tasks/tasks-manager";
import { env } from "./lib/env";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = env.NEXT_PUBLIC_APP_ENV !== "production";
const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  new TasksManager();

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : env.NEXT_PUBLIC_APP_ENV
    }`
  );
});
