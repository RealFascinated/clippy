import RecentFiles from "@/components/dashboard/user/files/recent-files";
import Statistics from "@/components/dashboard/user/statistic/statistics";
import StatisticHistoryGraph from "@/components/dashboard/user/statistic/graphs/statistic-history-graph";
import WelcomeBanner from "@/components/dashboard/user/welcome-banner";
import { env } from "@/lib/env";
import { getUser } from "@/lib/helpers/user";
import request from "@/lib/request";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { Metadata } from "next";
import { headers } from "next/headers";
import MimeTypeList from "@/components/dashboard/user/statistic/mime-type-list";
import TopMimeTypes from "@/components/dashboard/user/statistic/graphs/top-mime-types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
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

  const user = await getUser();
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <WelcomeBanner username={user.name} />

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
    </div>
  );
}
