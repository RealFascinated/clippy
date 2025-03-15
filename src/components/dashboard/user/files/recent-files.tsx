import { RecentFilesResponse } from "@/app/api/user/[@me]/files/recent/route";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { env } from "@/lib/env";
import request from "@/lib/request";
import { getFileName } from "@/lib/utils/file";
import { formatBytes } from "@/lib/utils/utils";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { headers } from "next/headers";
import FilePreview from "./file-preview";

export default async function RecentFiles({ user }: { user: UserType }) {
  const files = await request.get<RecentFilesResponse>(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/@me/files/recent`,
    {
      headers: {
        cookie: (await headers()).get("cookie"),
      },
    }
  );
  if (!files) {
    return null;
  }

  return (
    <div className="w-full h-[400px] flex flex-col">
      <div className="px-6 py-4 border-b border-muted/10">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Recent Files</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your most recently uploaded files
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0 h-full">
        {files.files.length > 0 ? (
          <>
            <div className="px-6 py-3 border-b border-muted/10 shrink-0">
              <div className="grid grid-cols-[2fr_1fr_2fr] gap-4">
                <div className="text-sm font-medium text-muted-foreground">
                  File Name
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Size
                </div>
                <div className="text-sm font-medium text-muted-foreground text-right">
                  Uploaded
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-4 h-full">
              <div className="space-y-1 py-2">
                {files.files.map((file) => (
                  <FilePreview fileMeta={file} user={user} key={file.id}>
                    <div
                      key={file.id}
                      className="grid grid-cols-[2fr_1fr_2fr] gap-4 py-2 px-2 rounded-lg hover:bg-muted/20 transition-all duration-200 group w-full"
                    >
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {getFileName(file)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatBytes(file.size, 1)}
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        {format(file.createdAt, "MMM d, yyyy HH:mm")}
                      </div>
                    </div>
                  </FilePreview>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Clock className="size-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No recent files</p>
            <p className="text-xs">Upload some files to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}
