import { UserMetricsType } from "@/lib/db/schemas/metrics";

export type UserGraphResponse = {
  statisticHistory: Record<string, UserMetricsType>;
};
