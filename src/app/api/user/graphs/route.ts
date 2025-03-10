import { handleApiRequestWithUser } from "@/lib/api-commons";
import { db } from "@/lib/db/drizzle";
import { metricsTable } from "@/lib/db/schemas/metrics";
import { getUserMetrics } from "@/lib/helpers/metrics";
import { UserGraphResponse } from "@/type/api/user/graph-response";
import { format } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<UserGraphResponse>> {
  return handleApiRequestWithUser(async user => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);
    const formattedDate = thirtyDaysAgo.toISOString().split("T")[0];

    const metrics = await db
      .select({
        date: metricsTable.date,
        storageMetrics: metricsTable.storageMetrics,
        fileMetrics: metricsTable.fileMetrics,
        userMetrics: metricsTable.userMetrics,
      })
      .from(metricsTable)
      .where(
        and(
          eq(metricsTable.userId, user.id),
          gte(metricsTable.date, formattedDate)
        )
      );

    const statisticHistory = metrics.reduce(
      (acc, curr) => {
        acc[curr.date as string] = curr;
        return acc;
      },
      {} as Record<string, (typeof metrics)[number]>
    );

    // Add today's metrics to the statistic history
    statisticHistory[format(new Date(), "yyyy-MM-dd")] = {
      ...(await getUserMetrics(user.id)),
      date: format(new Date(), "yyyy-MM-dd"),
    };

    return NextResponse.json(
      { statisticHistory: statisticHistory },
      { status: 200 }
    );
  });
}
