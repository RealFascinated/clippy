import { handleApiRequestWithUser } from "@/lib/api-commons";
import {
  getShortenedUrls,
  getShortenedUrlsCount,
  ShortenedUrlOptions,
} from "@/lib/helpers/shortened-urls";
import { Pagination } from "@/lib/pagination";
import { UserFilesSort } from "@/type/user/user-file-sort";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 18;

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

    // todo: validate the sort query

    const options: ShortenedUrlOptions = {
      limit: ITEMS_PER_PAGE,
      sort: sort,
      search: search,
    };

    const totalFiles = await getShortenedUrlsCount(options);
    const pagination = new Pagination();
    pagination.setItemsPerPage(ITEMS_PER_PAGE);
    pagination.setTotalItems(totalFiles);

    const paginatedPage = await pagination.getPage(
      Number(page),
      async fetchItems => {
        const files = await getShortenedUrls({
          ...options,
          offset: fetchItems.start,
        });

        return files;
      }
    );

    return NextResponse.json(paginatedPage, { status: 200 });
  });
}
