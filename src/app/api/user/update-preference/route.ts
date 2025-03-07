import { handleApiRequestWithUser } from "@/lib/api-commons";
import { updateUserPreferences } from "@/lib/preference";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApiRequestWithUser(async (user) => {
    const { showKitty, webhookUrl, notifications } = await request.json();
    await updateUserPreferences(user.id, {
      showKitty,
      webhookUrl,
      notifications,
    });
    return NextResponse.json({ message: "Preference Update" }, { status: 200 });
  });
}
