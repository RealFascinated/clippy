import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { getUserFiles, getUserFilesCount } from "@/lib/helpers/user";
import { Pagination } from "@/lib/pagination";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 15;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
): Promise<NextResponse | Response> {
  const page = Number((await params).page);
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return authError;
  }

  const totalFiles = await getUserFilesCount(session.user.id);
  const pagination = new Pagination();
  pagination.setItemsPerPage(ITEMS_PER_PAGE);
  pagination.setTotalItems(totalFiles);

  const paginatedPage = await pagination.getPage(page, async (fetchItems) => {
    const files = await getUserFiles(session.user.id, {
      limit: ITEMS_PER_PAGE,
      offset: fetchItems.start,
      sort: {
        key: "createdAt",
        direction: "desc",
      },
    });

    return files;
  });

  return NextResponse.json(paginatedPage, { status: 200 });
}
