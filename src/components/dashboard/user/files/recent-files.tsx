import { RecentFilesResponse } from "@/app/api/user/[@me]/files/recent/route";
import { env } from "@/lib/env";
import request from "@/lib/request";
import { getFileName } from "@/lib/utils/file";
import { formatBytes } from "@/lib/utils/utils";
import { format } from "date-fns";
import { headers } from "next/headers";
import Link from "next/link";

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
    <div className="w-full h-[350px] bg-background/70 rounded-lg border border-muted shadow-sm flex flex-col">
      <div className="px-3 py-2 border-b border-muted shrink-0">
        <h2 className="text-lg font-semibold">Recent Files</h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-muted/50 shrink-0">
          <div className="grid grid-cols-[2fr_1fr_0.7fr_1.5fr] gap-2">
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

        <div className="flex-1 overflow-y-auto min-h-0 p-3">
          <div className="space-y-1">
            {files.files.map((file) => (
              <Link
                href={`/${getFileName(file)}`}
                prefetch={false}
                key={file.id}
                target="_blank"
                className="grid grid-cols-[2fr_1fr_0.7fr_1.5fr] gap-2 py-1 px-1 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="text-sm truncate">{getFileName(file)}</div>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
