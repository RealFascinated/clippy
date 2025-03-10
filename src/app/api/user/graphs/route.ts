import { handleApiRequestWithUser } from "@/lib/api-commons";
import {
  getMimetypeDistribution,
  getStatisticHistory,
} from "@/lib/helpers/user";
import { UserGraphResponse } from "@/type/api/user/graph-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<UserGraphResponse>> {
  return handleApiRequestWithUser(async (user) => {
    return NextResponse.json(
      {
        statisticHistory: await getStatisticHistory(user.id),
        mimetypeDistribution: await getMimetypeDistribution(user.id),
      },
      { status: 200 }
    );
  });
}
