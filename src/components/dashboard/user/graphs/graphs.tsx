import { env } from "@/lib/env";
import request from "@/lib/request";
import { UserGraphResponse } from "@/type/api/user/graph-response";
import { headers } from "next/headers";
import StatisticHistoryGraph from "./statistic-history-graph";

export default async function UserGraphs() {
  const response = await request.get<UserGraphResponse>(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/graphs`,
    {
      headers: {
        cookie: (await headers()).get("cookie"),
      },
    }
  );
  if (!response) {
    return null;
  }

  return (
    <div className="w-full">
      <StatisticHistoryGraph userGraphData={response} />
    </div>
  );
}
