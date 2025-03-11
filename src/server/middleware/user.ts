import { UserType } from "@/lib/db/schemas/auth-schema";
import { getUser } from "@/lib/helpers/user";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: UserType;
  }
}

export async function userMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const user = await getUser(req.headers.cookie);
  if (!user) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  req.user = user;
}
