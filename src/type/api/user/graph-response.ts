import { UserMetricsType } from "@/lib/db/schemas/metrics";
import { MimetypeDistributionResponse } from "./mimetype-distrubution";

export type UserGraphResponse = {
  statisticHistory: Record<string, UserMetricsType>;
  mimetypeDistribution: MimetypeDistributionResponse;
};
