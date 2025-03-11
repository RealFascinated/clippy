import { env } from "@/lib/env";
import request from "@/lib/request";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { headers } from "next/headers";
import FileTypeList from "./file-type-list";
import UserFileTypeDistribution from "./graphs/file-type-distribution";
import StatisticHistoryGraph from "./graphs/statistic-history-graph";
import Statistics from "./statistics";

export default async function UserStatistics() {
  const statisticsResponse = await request.get<UserStatisticsResponse>(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/statistics`,
    {
      headers: {
        cookie: (await headers()).get("cookie"),
      },
    }
  );

  if (!statisticsResponse) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Statistics statisticsResponse={statisticsResponse} />
      <StatisticHistoryGraph userGraphData={statisticsResponse} />
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FileTypeList
          mimetypeDistribution={statisticsResponse.mimetypeDistribution}
        />
        <UserFileTypeDistribution userGraphData={statisticsResponse} />
      </div>
    </div>
  );
}
