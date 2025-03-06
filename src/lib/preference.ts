import { userPreferencesCache } from "@/lib/caches";
import { db } from "@/lib/db/drizzle";
import { preferencesTable, PreferencesType } from "@/lib/db/schemas/preference";
import { fetchWithCache } from "@/lib/utils/cache";
import { eq } from "drizzle-orm";

const defaultPreferences: PreferencesType = {
  showKitty: false,
  webhookUrl: null,
};

/**
 * Get the preferences for a user.
 *
 * @param userId the user's id
 * @returns the user's preferences
 */
export async function getUserPreferences(
  userId: string
): Promise<PreferencesType> {
  return await fetchWithCache(
    userPreferencesCache,
    `user-preferences:${userId}`,
    async () => {
      return (
        (
          await db
            .select()
            .from(preferencesTable)
            .where(eq(preferencesTable.userId, userId))
        )?.[0] ?? defaultPreferences
      );
    }
  );
}

/**
 * Updates the preferences for a user.
 *
 * @param userId the user's id
 * @param updates an object containing the preferences to update
 */
export async function updateUserPreferences(
  userId: string,
  updates: Partial<PreferencesType>
) {
  // First update the database, and then invalidate the in-memory cache
  userPreferencesCache.remove(`user-preferences:${userId}`);
  await db
    .insert(preferencesTable)
    .values({ userId: userId, ...updates })
    .onConflictDoUpdate({
      target: preferencesTable.userId,
      set: updates,
    });
}
