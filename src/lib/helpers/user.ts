import { users } from "@/lib/db/schemas/auth-schema";
import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";

/**
 * Gets a user by their upload token
 *
 * @param token the users upload token
 * @returns the user, or undefined if not found
 */
export async function getUserByUploadToken(token: string) {
  return (await db.select().from(users).where(eq(users.uploadToken, token)))[0];
}
