import { handleApiRequestWithUser } from "@/lib/api-commons";
import { getUserMetrics } from "@/lib/helpers/metrics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequestWithUser(async user => {
    const metrics = await getUserMetrics(user.id);
    return NextResponse.json(metrics, { status: 200 });
  });
}
