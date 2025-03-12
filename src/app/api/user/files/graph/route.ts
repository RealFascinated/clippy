import { handleApiRequestWithUser } from "@/lib/api-commons";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { getUserFiles } from "@/lib/helpers/user";
import { NextResponse } from "next/server";

export type ActivityGraphResponse = {
  graph: Record<string, number>;
  total: number;
};

export async function GET(): Promise<NextResponse | Response> {
  return handleApiRequestWithUser(async (user: UserType) => {
    // Map the files to a record of dates and counts: <year>-<month>-<day>: <count>
    const activityGraph: Record<string, number> = {};
    let total: number = 0;
    (await getUserFiles(user.id)).forEach((file) => {
      const date = new Date(file.createdAt);
      const dateString = date.toISOString().split("T")[0];
      activityGraph[dateString] = (activityGraph[dateString] || 0) + 1;
      total += 1;
    });
    return NextResponse.json({ graph: activityGraph, total }, { status: 200 });
  });
}
