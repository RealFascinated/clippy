import { handleApiRequestWithUser } from "@/lib/api-commons";
import { getUserMetrics } from "@/lib/helpers/metrics";
import { getStatisticHistory } from "@/lib/helpers/user";
import { getMimetypeDistribution } from "@/lib/helpers/user";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<UserStatisticsResponse>> {
  return handleApiRequestWithUser(async (user) => {
    const [statisticHistory, mimetypeDistribution] = await Promise.all([
      getStatisticHistory(user.id),
      getMimetypeDistribution(user.id),
    ]);

    return NextResponse.json(
      {
        statisticHistory,
        mimetypeDistribution,
      },
      { status: 200 }
    );
  });
}
