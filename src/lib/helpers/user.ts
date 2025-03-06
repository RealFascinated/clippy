import { users, UserType } from "@/lib/db/schemas/auth-schema";
import { env } from "@/lib/env";
import { getUserPreferences } from "@/lib/preference";
import request from "@/lib/request";
import { DiscordEmbed } from "@/type/discord";
import { UserFilesSort } from "@/type/user/user-file-sort";
import { AnyColumn, asc, count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { db } from "../db/drizzle";
import { fileTable } from "../db/schemas/file";
import { thumbnailTable } from "../db/schemas/thumbnail";
import { randomString } from "../utils/utils";
import { format } from "date-fns";

/**
 * Gets a user by their upload token
 *
 * @param token the users upload token
 * @returns the user, or undefined if not found
 */
export async function getUserByUploadToken(
  token: string
): Promise<UserType | undefined> {
  const user = (
    await db.select().from(users).where(eq(users.uploadToken, token))
  )[0];
  return user
    ? {
        ...user,
        preferences: await getUserPreferences(user.id),
      }
    : undefined;
}

/**
 * Gets a user by their id
 *
 * @param id the users id
 * @returns the user, or undefined if not found
 */
export async function getUserById(id: string): Promise<UserType | undefined> {
  const user = (await db.select().from(users).where(eq(users.id, id)))[0];
  return user
    ? {
        ...user,
        preferences: await getUserPreferences(user.id),
      }
    : undefined;
}

/**
 * Gets a user by their username
 *
 * @param username the user's username
 * @returns the user, or undefined if not found
 */
export async function getUserByName(
  username: string
): Promise<UserType | undefined> {
  const user = (
    await db.select().from(users).where(eq(users.username, username))
  )[0];
  return user
    ? {
        ...user,
        preferences: await getUserPreferences(user.id),
      }
    : undefined;
}

/**
 * Gets all of the users files.
 *
 * @param id the id of the user
 * @param options the options to fetch the files with
 * @returns the files for the user.
 */
export async function getUserFiles(
  id: string,
  options?: {
    sort?: UserFilesSort;
    limit?: number;
    offset?: number;
  }
) {
  const query = db.select().from(fileTable).where(eq(fileTable.userId, id));

  if (options?.limit) {
    query.limit(options.limit);
  }

  if (options?.offset) {
    query.offset(options.offset);
  }

  if (options?.sort) {
    const { key, direction } = options.sort;

    // Ensure the key is a valid column from fileTable
    const column = fileTable[key as keyof typeof fileTable] as AnyColumn;
    if (!column) {
      throw new Error(`Column "${key}" on ${fileTable._.name} was not found.`);
    }

    // Apply sorting based on the direction
    query.orderBy(direction === "asc" ? asc(column) : desc(column));
  }

  return await query;
}

/**
 * Gets all of the users thumbnails.
 *
 * @param id the id of the user
 * @returns the thumbnails for the user.
 */
export async function getUserThumbnails(id: string) {
  return await db
    .select()
    .from(thumbnailTable)
    .where(eq(thumbnailTable.userId, id));
}

/**
 * Gets the total amount of files
 * this user has uploaded
 *
 * @param id the id of the user
 * @returns the amount of files uploaded
 */
export async function getUserFilesCount(id: string) {
  const query = await db
    .select({ count: count() })
    .from(fileTable)
    .where(eq(fileTable.userId, id));
  return query[0].count ?? undefined;
}

/**
 * Updates a user in the database
 *
 * @param id the user's id
 * @param values the values to update
 */
export async function updateUser(id: string, values: Record<string, unknown>) {
  await db.update(users).set(values).where(eq(users.id, id));
}

/**
 * Generates a new upload token for a user
 *
 * @returns the upload token
 */
export function generateUploadToken() {
  return randomString(32);
}

/**
 * Get the current user. If the user is not
 * logged in, redirect to the main page.
 *
 * @returns the current user (wtf is the type? x.x)
 */
export async function getUser(): Promise<UserType> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // This shouldn't happen
  if (!session) {
    redirect("/");
  }
  return {
    ...(session.user as UserType),
    preferences: await getUserPreferences(session.user.id),
  };
}

/**
 * Dispatch a webhook event to the user's webhook url.
 *
 * @param user the user to dispatch the event to
 * @param embed the embed to send to the webhook
 */
export async function dispatchWebhookEvent(
  user: UserType,
  embed: DiscordEmbed
) {
  if (!user.preferences?.webhookUrl) return;
  const logo: string = env.NEXT_PUBLIC_WEBSITE_LOGO;
  await request.post(user.preferences.webhookUrl, {
    data: {
      username: env.NEXT_PUBLIC_WEBSITE_NAME,
      avatar_url: logo.startsWith("/")
        ? `${env.NEXT_PUBLIC_WEBSITE_URL}${logo}`
        : logo,
      embeds: [{
        ...embed,
        footer: {
          text: format(new Date(), "MM/dd/yyyy HH:mm a"),
        }
      }],
    },
  });
}
