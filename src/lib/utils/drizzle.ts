import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db/drizzle";
import Logger from "../logger";

/**
 * Run the database migrations
 */
export async function runMigrations() {
  const before = Date.now();
  await migrate(db, { migrationsFolder: "drizzle" });
  const after = Date.now();
  Logger.info(`Migrations completed in ${after - before}ms`);
}
