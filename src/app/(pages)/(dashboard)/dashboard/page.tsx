import RecentFiles from "@/components/dashboard/user/files/recent-files";
import StatisticHistoryGraph from "@/components/dashboard/user/statistic/graphs/statistic-history-graph";
import TopMimeTypes from "@/components/dashboard/user/statistic/graphs/top-mime-types";
import MimeTypeList from "@/components/dashboard/user/statistic/mime-type-list";
import Statistics from "@/components/dashboard/user/statistic/statistics";
import WelcomeBanner from "@/components/dashboard/user/welcome-banner";
import { env } from "@/lib/env";
import { getUser } from "@/lib/helpers/user";
import request from "@/lib/request";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { Metadata } from "next";
import { headers } from "next/headers";

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
    <div className="flex flex-col gap-6 w-full items-center max-w-[1600px] mx-auto px-4">
      <WelcomeBanner username={user.name} />

      <div className="flex flex-col gap-6 w-full">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg p-6">
          <Statistics statisticsResponse={statisticsResponse} />
        </div>

        <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg p-6">
          <StatisticHistoryGraph userGraphData={statisticsResponse} />
        </div>

        <div className="grid xl:grid-cols-3 gap-6 w-full">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg">
            <RecentFiles />
          </div>
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg">
            <MimeTypeList
              mimetypeDistribution={statisticsResponse.mimetypeDistribution}
            />
          </div>
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg">
            <TopMimeTypes userGraphData={statisticsResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}
