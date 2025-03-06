import { AppCache } from "@/lib/utils/cache";

export const userPreferencesCache = new AppCache({
  ttl: 1000 * 60 * 60, // 1 hour
  checkInterval: 1000 * 60 * 60, // 1 hour
});
