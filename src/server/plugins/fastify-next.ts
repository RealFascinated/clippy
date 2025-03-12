import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HTTPMethods,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import next, { NextConfig } from "next";
import { NextServer, RequestHandler } from "next/dist/server/next";

interface FastifyNextOptions {
  dev?: boolean;
  conf?: NextConfig;
  turbopack?: boolean;
  port?: number;
}

async function nextPlugin(
  fastify: FastifyInstance,
  options: FastifyNextOptions
) {
  const nextServer = next({
    dev: options.dev ?? false,
    conf: options.conf,
    turbopack: options.turbopack,
    port: options.port,
  });

  const handle = nextServer.getRequestHandler();

  fastify
    .decorate("nextServer", nextServer as unknown as NextServer)
    .decorate("nextHandle", handle)
    .decorate("next", route.bind(fastify));

  await nextServer.prepare();

  function route(
    this: FastifyInstance,
    path: string,
    method: HTTPMethods | HTTPMethods[] = "GET"
  ) {
    const methods = Array.isArray(method) ? method : [method];

    this.route({
      method: methods,
      url: path,
      handler: async (req: FastifyRequest, reply: FastifyReply) => {
        try {
          for (const [key, value] of Object.entries(reply.getHeaders())) {
            if (value !== undefined) {
              reply.header(key, value);
            }
          }

          await handle(req.raw, reply.raw);
          reply.hijack();
        } catch (err) {
          reply.send(err);
        }
      },
    });
  }
}

export default fastifyPlugin(nextPlugin, {
  name: "next",
  fastify: "5.x",
});

// Type declarations for Fastify
declare module "fastify" {
  interface FastifyInstance {
    nextServer: NextServer;
    next: (path: string, method?: HTTPMethods | HTTPMethods[]) => void;
    nextHandle: RequestHandler;
  }
}
