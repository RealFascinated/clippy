import { db } from "@/lib/db/drizzle";
import { users as usersTable } from "@/lib/db/schemas/auth-schema";
import { metricsTable } from "@/lib/db/schemas/metrics";
import { getUserMetrics } from "@/lib/helpers/metrics";
import Logger from "@/lib/logger";
import { getMidightAllignedDate } from "@/lib/utils/date";
import Task from "../task";

export default class UserMetricsTask extends Task {
  constructor() {
    // super("User Metrics Task", "0 * * * * *"); // Run every minute
    super("User Metrics Task", "0 59 23 * * *"); // Run at 23:59 every day
  }

  async run(): Promise<void> {
    const users = await db.select().from(usersTable);
    if (users.length === 0) {
      Logger.info("No users found, not generating metrics");
      return;
    }

    Logger.info(`Generating metrics for ${users.length} users`);

    const today = getMidightAllignedDate(new Date());
    for (const user of users) {
      Logger.info(`Generating metrics for ${user.username}`);
      const before = performance.now();
      const metrics = await getUserMetrics(user.id);

      await db
        .insert(metricsTable)
        .values({
          userId: user.id,
          date: today.toISOString(),
          storageMetrics: metrics.storageMetrics,
          fileMetrics: metrics.fileMetrics,
          userMetrics: metrics.userMetrics,
        })
        .onConflictDoUpdate({
          target: [metricsTable.userId, metricsTable.date],
          set: {
            storageMetrics: metrics.storageMetrics,
            fileMetrics: metrics.fileMetrics,
            userMetrics: metrics.userMetrics,
          },
        })
        .catch(err => {
          Logger.error(`Error inserting metrics for ${user.username}: ${err}`);
        });

      Logger.info(
        `Generated metrics for ${user.username} in ${(
          performance.now() - before
        ).toFixed(2)}ms`
      );
    }
  }
}
