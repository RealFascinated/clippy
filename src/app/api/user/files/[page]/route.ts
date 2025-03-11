import { handleApiRequestWithUser } from "@/lib/api-commons";
import {
  getUserFiles,
  getUserFilesCount,
  UserFilesOptions,
} from "@/lib/helpers/user";
import { Pagination } from "@/lib/pagination";
import { UserFilesSort } from "@/type/user/user-file-sort";
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
  return handleApiRequestWithUser(async user => {
    const { page } = await params;

    const searchParams = request.nextUrl.searchParams;
    const sort = {
      key: searchParams.get("sortKey") ?? "createdAt",
      direction: searchParams.get("sortDirection") ?? "desc",
    } as UserFilesSort;
    const search = searchParams.get("search") ?? "";
    const favoritedOnly =
      (searchParams.get("favoritedOnly") ?? "false") === "true";
    const videosOnly = (searchParams.get("videosOnly") ?? "false") === "true";

    // todo: validate the sort query

    const options: UserFilesOptions = {
      limit: ITEMS_PER_PAGE,
      sort: sort,
      search: search,
      favoritedOnly: favoritedOnly,
      videosOnly: videosOnly,
    };

    const totalFiles = await getUserFilesCount(user.id, options);
    const pagination = new Pagination();
    pagination.setItemsPerPage(ITEMS_PER_PAGE);
    pagination.setTotalItems(totalFiles);

    const paginatedPage = await pagination.getPage(
      Number(page),
      async fetchItems => {
        const files = await getUserFiles(user.id, {
          ...options,
          offset: fetchItems.start,
        });

        return files;
      }
    );

    return NextResponse.json(paginatedPage, { status: 200 });
  });
}
