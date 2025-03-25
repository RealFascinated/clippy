import { count, sum } from "drizzle-orm";
import { db } from "../db/drizzle";
import { fileTable } from "../db/schemas/file";
import { users } from "../../../auth-schema";

type ServerMetrics = {
  totalFiles: number;
  totalUsers: number;
  totalStorage: number;
};

/**
 * Get the server metrics
 * 
 * @returns The server metrics
 */
export async function getServerMetrics(): Promise<ServerMetrics> {
  const totalFiles = await db.select({
    count: count(),
  }).from(fileTable);
  const totalStorage = await db.select({
    sum: sum(fileTable.size),
  }).from(fileTable);

  const totalUsers = await db.select({
    count: count(),
  }).from(users);

  return {
    totalFiles: Number(totalFiles[0].count) || 0,
    totalUsers: Number(totalUsers[0].count) || 0,
    totalStorage: Number(totalStorage[0].sum) || 0,
  };
}
