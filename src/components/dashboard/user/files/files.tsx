"use client";

import Pagination from "@/components/pagination";
import Loader from "@/components/ui/loader";
import { FileType } from "@/lib/db/schemas/file";
import { Page } from "@/lib/pagination";
import request from "@/lib/request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UserFile from "./file";

export default function UserFiles() {
  const [page, setPage] = useState<number>(1);

  const {
    data: files,
    isLoading,
    refetch,
  } = useQuery<Page<FileType>>({
    queryKey: ["userFiles", page],
    queryFn: async () => (await request.get<Page<FileType>>(`/api/user/files/${page}`))!,
    placeholderData: data => data,
  });

  return (
    <div className="flex flex-col gap-2 w-full bg-secondary/90 rounded-md p-2 border">
      <span className="font-semibold">Your Files</span>
      <span className="text-muted-foreground">All of your files you have uploaded</span>

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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-center">
                {files.items.map((file, index) => (
                  <UserFile
                    key={index}
                    file={file}
                    refetch={async () => {
                      await refetch();
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <span className="text-red-400">No files found, or unknown page</span>
          )}

          <Pagination
            page={page}
            totalItems={files.metadata.totalItems}
            itemsPerPage={files.metadata.itemsPerPage}
            loadingPage={isLoading ? page : undefined}
            onPageChange={newPage => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
