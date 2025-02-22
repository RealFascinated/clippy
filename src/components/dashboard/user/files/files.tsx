"use client";

import request from "@/lib/request";
import { RecentFilesResponse } from "@/type/api/user/recent-files-response";
import { useQuery } from "@tanstack/react-query";
import UserFile from "./file";

export default function UserFiles() {
  const {
    data: files,
    isLoading,
    refetch,
  } = useQuery<RecentFilesResponse>({
    queryKey: ["userFiles"],
    queryFn: async () =>
      (await request.get<RecentFilesResponse>("/api/user/files"))!,
    placeholderData: (data) => data,
  });

  if (!files || isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full bg-secondary/90 rounded-md p-2 border">
      <span className="font-semibold">Your Files</span>
      {files.files.length !== 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-center">
          {files.files.map((file, index) => (
            <UserFile
              key={index}
              file={file}
              refetch={async () => {
                await refetch();
              }}
            />
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">
          You do not have any files uploaded
        </span>
      )}
    </div>
  );
}
