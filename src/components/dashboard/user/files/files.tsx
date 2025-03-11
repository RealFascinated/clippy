"use client";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScreenSize, useIsScreenSize } from "@/hooks/use-mobile";
import usePageUrl from "@/hooks/use-page-url";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { Page } from "@/lib/pagination";
import request from "@/lib/request";
import { FileKeys } from "@/type/file/file-keys";
import { SortDirection } from "@/type/sort-direction";
import { UserFilesSort } from "@/type/user/user-file-sort";
import { useQuery } from "@tanstack/react-query";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserFile from "./file";

const sortNames: {
  name: string;
  key: FileKeys;
}[] = [
  {
    name: "Upload Date",
    key: "createdAt",
  },
  {
    name: "Views",
    key: "views",
  },
  {
    name: "Size",
    key: "size",
  },
];

export default function UserFiles({
  user,
  favoritedOnly,
  videosOnly,
  initialSearch,
  initialPage,
}: {
  user: UserType;
  favoritedOnly?: boolean;
  videosOnly?: boolean;
  initialSearch?: string;
  initialPage?: number;
}) {
  const pathname = usePathname();
  const initialRender = useIsFirstRender();
  const isMobile = useIsScreenSize(ScreenSize.Small);
  const { changePageUrl } = usePageUrl();

  const [page, setPage] = useState<number>(() => {
    const parsedInitialPage = Number(initialPage);
    return !isNaN(parsedInitialPage) && parsedInitialPage > 0
      ? parsedInitialPage
      : 1;
  });
  const [search, setSearch] = useState<string>(initialSearch ?? "");
  const [sort, setSort] = useState<UserFilesSort>({
    key: "createdAt",
    direction: "desc",
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSortKey = localStorage.getItem("sortKey") as FileKeys;
      const savedSortDirection = localStorage.getItem(
        "sortDirection"
      ) as SortDirection;

      if (savedSortKey || savedSortDirection) {
        setSort({
          key: savedSortKey ?? "createdAt",
          direction: savedSortDirection ?? "desc",
        });
      }
    }
  }, []);

  // Only reset page on user-initiated changes
  useEffect(() => {
    if (hasUserInteracted) {
      setPage(1);
    }
  }, [debouncedSearch, sort, hasUserInteracted]);

  useEffect(() => {
    if (initialRender) {
      return;
    }

    if (!isNaN(page) && page > 0) {
      changePageUrl(pathname, {
        ...(page !== 1 && { page: String(page) }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
    }
  }, [debouncedSearch, page]);

  // Update handlers to set hasUserInteracted
  const handleSortChange = (value: string) => {
    setHasUserInteracted(true);
    setSort({
      ...sort,
      key: value as FileKeys,
    });
    localStorage.setItem("sortKey", value);
  };

  const handleDirectionChange = () => {
    setHasUserInteracted(true);
    const direction = sort.direction === "asc" ? "desc" : "asc";
    setSort({
      ...sort,
      direction: direction,
    });
    localStorage.setItem("sortDirection", direction);
  };

  const handleSearch = (value: string) => {
    setHasUserInteracted(true);
    setSearch(value);
  };

  const handleClearSearch = () => {
    setHasUserInteracted(true);
    setSearch("");
  };

  const {
    data: files,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<Page<FileType>>({
    queryKey: [
      "userFiles",
      page,
      sort,
      debouncedSearch,
      favoritedOnly,
      videosOnly,
    ],
    queryFn: async () =>
      (await request.get<Page<FileType>>(`/api/user/files/${page}`, {
        searchParams: {
          sortKey: sort.key,
          sortDirection: sort.direction,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(favoritedOnly && { favoritedOnly: "true" }),
          ...(videosOnly && { videosOnly: "true" }),
        },
      }))!,
    placeholderData: data => data,
  });

  return (
    <div className="flex flex-col gap-2 w-full bg-background/70 rounded-md p-2 border border-muted">
      <div className="flex flex-col gap-2 justify-between sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1 select-none">
          <span className="font-semibold">Uploads</span>
          <span className="text-muted-foreground">
            All files associated with your account
          </span>
        </div>

        {/* File Sorting */}
        <div className="flex gap-2 sm:mr-2 select-none">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Input
              placeholder="Query..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pr-8"
            />
            {search && (
              <button
                className="absolute right-0 top-0 h-full w-6.5 p-0"
                onClick={handleClearSearch}
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Sort By */}
          <Select value={sort.key} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                {sortNames.map((value, index) => (
                  <SelectItem key={index} value={value.key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Sort Direction */}
          <Button
            variant="outline"
            className="border-input"
            onClick={handleDirectionChange}
          >
            {sort.direction === "asc" ? (
              <ArrowUpNarrowWide className="size-5" />
            ) : (
              <ArrowDownWideNarrow className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="w-full flex justify-center">
          <Loader />
        </div>
      )}

      {/* File Previews */}
      {files !== undefined && (
        <>
          {files.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center">
                {files.items.map(fileMeta => (
                  <UserFile
                    user={user}
                    key={fileMeta.id}
                    fileMeta={fileMeta}
                    refetch={async () => {
                      await refetch();
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <span className="text-red-400">
              {favoritedOnly
                ? "No favorited files found"
                : "No files found, or unknown page"}
            </span>
          )}

          <Pagination
            mobilePagination={isMobile}
            page={page}
            totalItems={files.metadata.totalItems}
            itemsPerPage={files.metadata.itemsPerPage}
            loadingPage={isLoading || isRefetching ? page : undefined}
            onPageChange={newPage => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
