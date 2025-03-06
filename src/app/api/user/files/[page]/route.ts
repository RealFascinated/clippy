import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { getUserFiles, getUserFilesCount } from "@/lib/helpers/user";
import { Pagination } from "@/lib/pagination";
import { UserFilesSort } from "@/type/user/user-file-sort";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 15;

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ page: string }>;
  }
): Promise<NextResponse | Response> {
  const { page } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return authError;
  }

  const searchParams = request.nextUrl.searchParams;
  const sort = {
    key: searchParams.get("sortKey") ?? "createdAt",
    direction: searchParams.get("sortDirection") ?? "desc",
  } as UserFilesSort;

  // todo: validate the sort query

  const totalFiles = await getUserFilesCount(session.user.id);
  const pagination = new Pagination();
  pagination.setItemsPerPage(ITEMS_PER_PAGE);
  pagination.setTotalItems(totalFiles);

  const paginatedPage = await pagination.getPage(
    Number(page),
    async (fetchItems) => {
      const files = await getUserFiles(session.user.id, {
        limit: ITEMS_PER_PAGE,
        offset: fetchItems.start,
        sort: sort,
      });

      return files;
    }
  );

  return NextResponse.json(paginatedPage, { status: 200 });
}
