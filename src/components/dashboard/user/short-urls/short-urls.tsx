"use client";

import type { ShortenedUrlType } from "@/lib/db/schemas/shortened-urls";
import { Page } from "@/lib/pagination";
import request from "@/lib/request";
import { cn } from "@/lib/utils/utils";
import { SortDirection } from "@/type/sort-direction";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterableContainer, {
  SortOption,
} from "../../common/filterable-container";
import UserShortUrl from "./short-url";

const sortOptions: SortOption[] = [
  {
    name: "Creation Date",
    key: "createdAt",
  },
  {
    name: "Clicks",
    key: "clicks",
  },
];

export default function UserShortLinks({
  initialSearch,
  initialPage,
}: {
  initialSearch?: string;
  initialPage?: number;
}) {
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(initialPage ?? 1);

  const {
    data: links,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<Page<ShortenedUrlType>>({
    queryKey: ["userFiles", page, initialSearch, sort.key, sort.direction],
    queryFn: async () =>
      (await request.get<Page<ShortenedUrlType>>(
        `/api/user/@me/short-links/${page}`,
        {
          searchParams: {
            ...(initialSearch && { search: initialSearch }),
            sortKey: sort.key,
            sortDirection: sort.direction,
          },
        }
      ))!,
    placeholderData: data => data,
  });

  const gridCols =
    "grid-cols-[0.8fr_1fr_1.3fr] lg:grid-cols-[1fr_1fr_1fr_1fr] p-2";

  return (
    <FilterableContainer
      title="Short Links"
      description="View and manage your short links"
      searchPlaceholder="Search links..."
      noItemsTitle="No links found"
      noItemsDescription="Create some links or try a different search"
      sortOptions={sortOptions}
      data={links}
      isLoading={isLoading}
      isRefetching={isRefetching}
      initialSearch={initialSearch}
      initialPage={initialPage}
      sortKey="shortLinks"
      onSortChange={newSort => setSort(newSort)}
      initialSort={sort}
      onPageChange={newPage => setPage(newPage)}
    >
      <div className="flex flex-col gap-2">
        <div className={cn("grid gap-2", gridCols)}>
          <span className="text-sm text-muted-foreground font-medium">ID</span>
          <span className="text-sm text-muted-foreground font-medium">URL</span>
          <span className="text-sm text-muted-foreground font-medium lg:block hidden">
            Clicks
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            Creation Date
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {links?.items.map(link => (
            <UserShortUrl
              key={link.id}
              link={link}
              className={gridCols}
              refetch={async () => {
                await refetch();
              }}
            />
          ))}
        </ul>
      </div>
    </FilterableContainer>
  );
}
