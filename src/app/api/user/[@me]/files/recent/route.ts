import { handleApiRequestWithUser } from "@/lib/api-commons";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { getUserFiles } from "@/lib/helpers/user";
import { NextResponse } from "next/server";

export type RecentFilesResponse = {
  files: FileType[];
};

export async function GET(): Promise<NextResponse | Response> {
  return handleApiRequestWithUser(async (user: UserType) => {
    return NextResponse.json(
      {
        files: await getUserFiles(user.id, {
          limit: 25,
          sort: {
            key: "createdAt",
            direction: "desc",
          },
        }),
      },
      { status: 200 }
    );
  });
}
