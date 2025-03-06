"use client";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
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
import { FileType } from "@/lib/db/schemas/file";
import { Page } from "@/lib/pagination";
import request from "@/lib/request";
import { FileKeys } from "@/type/file/file-keys";
import { SortDirection } from "@/type/sort-direction";
import { UserFilesSort } from "@/type/user/user-file-sort";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown01, ArrowDown10 } from "lucide-react";
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

export default function UserFiles() {
  const isMobile = useIsScreenSize(ScreenSize.Small);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<UserFilesSort>({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    setSort({
      key: (localStorage.getItem("sortKey") as FileKeys) ?? sort.key,
      direction:
        (localStorage.getItem("sortDirection") as SortDirection) ??
        sort.direction,
    });
  }, []);

  const {
    data: files,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<Page<FileType>>({
    queryKey: ["userFiles", page, sort],
    queryFn: async () =>
      (await request.get<Page<FileType>>(`/api/user/files/${page}`, {
        searchParams: {
          sortKey: sort.key,
          sortDirection: sort.direction,
        },
      }))!,
    placeholderData: data => data,
  });

  return (
    <div className="flex flex-col gap-2 w-full bg-background/70 rounded-md p-2 border border-muted">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Uploads</span>
          <span className="text-muted-foreground">
            All files associated with your account
          </span>
        </div>

        {/* File Sorting */}
        <div className="flex gap-2 mr-2">
          {/* Sort By */}
          <Select
            value={sort.key}
            onValueChange={value => {
              setSort({
                ...sort,
                key: value as FileKeys,
              });
              localStorage.setItem("sortKey", value);
            }}
          >
            <SelectTrigger className="w-[180px]">
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
            onClick={() => {
              const direction = sort.direction == "asc" ? "desc" : "asc";
              setSort({
                ...sort,
                direction: direction,
              });
              localStorage.setItem("sortDirection", direction);
            }}
          >
            {sort.direction == "asc" ? (
              <ArrowDown01 className="size-5" />
            ) : (
              <ArrowDown10 className="size-5" />
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
                {files.items.map((fileMeta, index) => (
                  <UserFile
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
              No files found, or unknown page
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
