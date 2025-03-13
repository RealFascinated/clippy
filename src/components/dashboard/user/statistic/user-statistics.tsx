import { env } from "@/lib/env";
import request from "@/lib/request";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { headers } from "next/headers";
import RecentFiles from "../files/recent-files";
import MimeTypeList from "./mime-type-list";
import StatisticHistoryGraph from "./graphs/statistic-history-graph";
import Statistics from "./statistics";
import TopMimeTypes from "./graphs/top-mime-types";

export default async function UserStatistics() {
  const statisticsResponse = await request.get<UserStatisticsResponse>(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/@me/statistics`,
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
      <div className="flex flex-col xl:flex-row gap-4 w-full">
        <RecentFiles />
        <MimeTypeList
          mimetypeDistribution={statisticsResponse.mimetypeDistribution}
        />
        <TopMimeTypes userGraphData={statisticsResponse} />
      </div>
    </div>
  );
}
