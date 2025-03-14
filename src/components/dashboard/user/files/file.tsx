"use client";

import FileContextMenu from "@/components/dashboard/user/files/file-context-menu";
import FileExtensionIcon from "@/components/file-icon";
import SimpleTooltip from "@/components/simple-tooltip";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { formatTimeAgo } from "@/lib/utils/date";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { cn, formatBytes } from "@/lib/utils/utils";
import { format } from "date-fns";
import { HeartIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import FilePreview from "./file-preview";

export type UserFileProps = {
  user: UserType;
  fileMeta: FileType;
  refetch: () => Promise<void>;
};

export default function UserFile({ user, fileMeta, refetch }: UserFileProps) {
  const url = `/${getFileName(fileMeta)}`;
  const isVideo = fileMeta.mimeType.startsWith("video");
  const isImage = fileMeta.mimeType.startsWith("image");
  const hasThumbnail = (isImage || isVideo) && fileMeta.hasThumbnail;
  const exactDate: string = format(fileMeta.createdAt, "dd/MM/yyyy - HH:mm a");

  async function favoriteFile() {
    const response = await fetch(
      `/api/user/@me/file/favorite/${getFileName(fileMeta)}`,
      {
        method: fileMeta.favorited ? "DELETE" : "POST",
      }
    );

    if (response.ok) {
      refetch();
    }
  }

  return (
    <FileContextMenu user={user} fileMeta={fileMeta} refetch={refetch}>
      <div className="bg-card h-full flex flex-col items-center rounded-lg overflow-hidden group">
        <div className="h-full w-full flex flex-col">
          {/* Preview Section */}
          <div className="relative h-48 w-full bg-muted/50">
            {hasThumbnail ? (
              <FilePreview fileMeta={fileMeta} user={user}>
                {isImage || (isVideo && fileMeta.hasThumbnail) ? (
                  <>
                    <img
                      src={`/thumbnails/${fileMeta.id}.webp`}
                      alt="Recent File Image Preview"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <PlayIcon className="size-12 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        Click to open
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex justify-center items-center text-muted-foreground">
                    Missing Thumbnail
                  </div>
                )}
              </FilePreview>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="w-16">
                  <FileExtensionIcon extension={fileMeta.extension} />
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              {/* File Name */}
              <Link
                href={url}
                className="font-medium truncate hover:text-primary transition-colors text-sm sm:text-base"
                target="_blank"
                prefetch={false}
              >
                {getFileName(fileMeta)}
              </Link>

              <span className="text-xs sm:text-sm bg-muted/50 px-1.5 py-0.5 rounded-md select-none">
                {fileMeta.extension.toUpperCase()}
              </span>
            </div>

            {/* Upload Date */}
            <SimpleTooltip content={`Uploaded on ${exactDate}`}>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {formatTimeAgo(fileMeta.createdAt)}
              </span>
            </SimpleTooltip>

            {/* Stats */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <span>{formatBytes(fileMeta.size)}</span>
                <span className="hidden sm:inline">•</span>
                <span>
                  {formatNumberWithCommas(fileMeta.views)} View
                  {fileMeta.views === 1 ? "" : "s"}
                </span>
              </div>
              <SimpleTooltip
                content={fileMeta.favorited ? "Unfavorite" : "Favorite"}
              >
                <button
                  className="hover:text-red-400 transition-colors cursor-pointer"
                  onClick={favoriteFile}
                >
                  <HeartIcon
                    className={cn(
                      fileMeta.favorited
                        ? "text-red-400"
                        : "text-muted-foreground",
                      "size-5 transition-all transform-gpu"
                    )}
                  />
                </button>
              </SimpleTooltip>
            </div>
          </div>
        </div>
      </div>
    </FileContextMenu>
  );
}
