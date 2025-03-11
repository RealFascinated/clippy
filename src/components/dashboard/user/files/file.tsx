"use client";

import FileContextMenu from "@/components/dashboard/user/files/file-context-menu";
import FileExtensionIcon from "@/components/file-icon";
import FileVideoPlayer from "@/components/file/video-player";
import SimpleTooltip from "@/components/simple-tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { cn, formatBytes } from "@/lib/utils/utils";
import { format, formatDistance } from "date-fns";
import { HeartIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type UserFileProps = {
  user: UserType;
  fileMeta: FileType;
  refetch: () => Promise<void>;
};

export default function UserFile({ user, fileMeta, refetch }: UserFileProps) {
  const url = `/${getFileName(fileMeta)}`;
  const hasThumbnail =
    fileMeta.mimeType.startsWith("video") ||
    fileMeta.mimeType.startsWith("image");

  const currentDate = new Date();
  const uploadedDate = new Date(fileMeta.createdAt);
  const difference = currentDate.getTime() - uploadedDate.getTime();

  const exactDate: string = format(fileMeta.createdAt, "dd/MM/yyyy - HH:mm a");
  const formattedDate =
    difference > 86400000 // 24 hours in milliseconds
      ? format(uploadedDate, "MM/dd/yyyy HH:mm a")
      : formatDistance(uploadedDate, currentDate) + " ago";

  async function favoriteFile() {
    const response = await fetch(
      `/api/user/file/favorite/${getFileName(fileMeta)}`,
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
      <div className="bg-card h-full flex flex-col items-center rounded-md">
        <div className="h-full p-2 flex flex-col gap-1">
          <div className="flex flex-col items-center select-none">
            {/* File Name */}
            <Link
              href={url}
              className="hover:opacity-80 cursor-pointer transition-all transform-gpu"
              target="_blank"
              prefetch={false}
            >
              {getFileName(fileMeta)}
            </Link>

            {/* Upload Date */}
            <SimpleTooltip content={`Uploaded on ${exactDate}`}>
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </SimpleTooltip>
          </div>

          {/* Preview */}
          <div className="flex-1 flex items-center w-full justify-center">
            {hasThumbnail ? (
              <FilePreview fileMeta={fileMeta} />
            ) : (
              <div className="flex justify-center items-center">
                <div className="w-16">
                  <FileExtensionIcon extension={fileMeta.extension} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2 items-center justify-between w-full px-1.5 bg-zinc-800/65 py-1 rounded-bl-md rounded-br-md">
          <div className="flex flex-row divide-x-2 divide-card">
            <span className="text-sm text-muted-foreground pr-2">
              {formatBytes(fileMeta.size)}
            </span>
            <span className="text-sm text-muted-foreground pl-2">
              {formatNumberWithCommas(fileMeta.views)} View
              {fileMeta.views == 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SimpleTooltip
              content={fileMeta.favorited ? "Unfavorite" : "Favorite"}
            >
              <button
                className="text-sm text-muted-foreground cursor-pointer"
                onClick={favoriteFile}
              >
                <HeartIcon
                  className={cn(
                    fileMeta.favorited
                      ? "text-red-400 hover:text-muted-foreground"
                      : "text-muted-foreground hover:text-red-400",
                    "size-4 transition-all transform-gpu"
                  )}
                />
              </button>
            </SimpleTooltip>
          </div>
        </div>
      </div>
    </FileContextMenu>
  );
}

function FilePreview({ fileMeta }: { fileMeta: FileType }) {
  const url = `/${getFileName(fileMeta)}?incrementviews=false`;
  const isImage = fileMeta.mimeType.startsWith("image");
  const isVideo = fileMeta.mimeType.startsWith("video");

  const [loading, setLoading] = useState<boolean>(
    isVideo || isImage ? true : false
  );

  return (
    <Dialog>
      <DialogTrigger className="relative cursor-pointer w-full flex items-center justify-center min-h-36">
        {isImage || (isVideo && fileMeta.hasThumbnail) ? (
          <>
            <img
              src={`/thumbnails/${fileMeta.id}.webp`}
              alt="Recent File Image Preview"
              className="transparent max-h-36 rounded-sm"
            />
            {isVideo && (
              <PlayIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10" />
            )}
          </>
        ) : (
          loading && (
            <div className="w-full flex justify-center items-center">
              Missing Thumbnail
            </div>
          )
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center w-full sm:w-fit lg:max-w-4xl min-w-80">
        <DialogHeader>
          <DialogTitle>{getFileName(fileMeta)}</DialogTitle>
        </DialogHeader>
        {isImage && (
          <img
            src={url}
            alt={`Image for ${getFileName(fileMeta)}`}
            className="max-h-[70vh]"
            draggable={false}
          />
        )}

        {isVideo && <FileVideoPlayer url={url} className="max-h-[70vh]" />}
      </DialogContent>
    </Dialog>
  );
}
