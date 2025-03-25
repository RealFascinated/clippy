"use client";

import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { Page } from "@/lib/pagination";
import request from "@/lib/request";
import { capitalize } from "@/lib/utils/utils";
import { FilesLookupType } from "@/type/files-lookup-type";
import { SortDirection } from "@/type/sort-direction";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterableContainer, {
  SortOption,
} from "../../common/filterable-container";
import UserFile from "./file";

const sortOptions: SortOption[] = [
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
  type,
  initialSearch,
  initialPage,
}: {
  user: UserType;
  type: FilesLookupType;
  initialSearch?: string;
  initialPage?: number;
}) {
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(initialPage ?? 1);

  const {
    data: files,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<Page<FileType>>({
    queryKey: [
      "userFiles",
      page,
      initialSearch,
      type,
      sort.key,
      sort.direction,
    ],
    queryFn: async () =>
      (await request.get<Page<FileType>>(`/api/user/@me/files/${page}`, {
        searchParams: {
          ...(initialSearch && { search: initialSearch }),
          ...(type && {
            [`${type}Only`]: "true",
          }),
          sortKey: sort.key,
          sortDirection: sort.direction,
        },
      }))!,
    placeholderData: data => data,
  });

  return (
    <FilterableContainer
      title={`${capitalize(type ?? "overview")} Files`}
      description={`View and manage ${type ? `your ${type} files` : "all your uploaded files"}`}
      searchPlaceholder="Search files..."
      noItemsTitle="No files found"
      noItemsDescription="Upload some files or try a different search"
      sortOptions={sortOptions}
      data={files}
      isLoading={isLoading}
      isRefetching={isRefetching}
      initialSearch={initialSearch}
      initialPage={initialPage}
      sortKey="userFiles"
      onSortChange={newSort => setSort(newSort)}
      initialSort={sort}
      onPageChange={newPage => setPage(newPage)}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {files?.items.map(fileMeta => (
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
    </FilterableContainer>
  );
}
