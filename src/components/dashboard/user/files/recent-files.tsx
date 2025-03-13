import { RecentFilesResponse } from "@/app/api/user/[@me]/files/recent/route";
import { env } from "@/lib/env";
import request from "@/lib/request";
import { getFileName } from "@/lib/utils/file";
import { formatBytes } from "@/lib/utils/utils";
import { format } from "date-fns";
import { headers } from "next/headers";
import Link from "next/link";
import { Clock } from "lucide-react";

export default async function RecentFiles() {
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
        <h2 className="text-lg font-semibold">Recent Files</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your most recently uploaded files
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-3 border-b border-muted/10 shrink-0">
          <div className="grid grid-cols-[2fr_1fr_0.7fr_1.5fr] gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              File Name
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Size
            </div>
            <div className="text-sm font-medium text-muted-foreground text-center">
              Views
            </div>
            <div className="text-sm font-medium text-muted-foreground text-right">
              Uploaded
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4">
          <div className="space-y-1 py-2">
            {files.files.length > 0 ? (
              files.files.map((file) => (
                <Link
                  href={`/${getFileName(file)}`}
                  prefetch={false}
                  key={file.id}
                  target="_blank"
                  className="grid grid-cols-[2fr_1fr_0.7fr_1.5fr] gap-4 py-2 px-2 rounded-lg hover:bg-muted/20 transition-all duration-200 group"
                >
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {getFileName(file)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatBytes(file.size, 1)}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {file.views}
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {format(file.createdAt, "MMM d, yyyy HH:mm a")}
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Clock className="size-12 mb-2 opacity-50" />
                <p className="text-sm font-medium">No recent files</p>
                <p className="text-xs">Upload some files to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
