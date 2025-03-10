import { UserMetricsType } from "@/lib/db/schemas/metrics";
import { MimetypeDistribution } from "./mimetype-distrubution";

export type UserStatisticsResponse = {
  statisticHistory: Record<string, UserMetricsType>;
  mimetypeDistribution: MimetypeDistribution;
};
