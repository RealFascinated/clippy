"use client";

import FileContextMenu from "@/components/dashboard/user/files/file-context-menu";
import FileExtensionIcon from "@/components/file-icon";
import FileVideoPlayer from "@/components/file/video-player";
import SimpleTooltip from "@/components/simple-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { cn, copyWithToast, formatBytes } from "@/lib/utils/utils";
import { format, formatDistance } from "date-fns";
import {
  Download,
  ExternalLink,
  HeartIcon,
  Link2,
  PlayIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
          <div className="relative aspect-square w-full bg-muted/50">
            {hasThumbnail ? (
              <FilePreview fileMeta={fileMeta} user={user} />
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
            {/* File Name */}
            <Link
              href={url}
              className="font-medium truncate hover:text-primary transition-colors text-sm sm:text-base"
              target="_blank"
              prefetch={false}
            >
              {getFileName(fileMeta)}
            </Link>

            {/* Upload Date */}
            <SimpleTooltip content={`Uploaded on ${exactDate}`}>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {formattedDate}
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

function FilePreview({
  fileMeta,
  user,
}: {
  fileMeta: FileType;
  user: UserType;
}) {
  const url = `/${getFileName(fileMeta)}?incrementviews=false`;
  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
  const isImage = fileMeta.mimeType.startsWith("image");
  const isVideo = fileMeta.mimeType.startsWith("video");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState<boolean>(
    isVideo || isImage ? true : false
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Trigger mount animation
      requestAnimationFrame(() => {
        setIsMounted(true);
      });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <button
        className="relative cursor-pointer w-full h-full flex items-center justify-center group"
        onClick={() => setIsOpen(true)}
      >
        {isImage || (isVideo && fileMeta.hasThumbnail) ? (
          <>
            <img
              src={`/thumbnails/${fileMeta.id}.webp`}
              alt="Recent File Image Preview"
              className="w-full h-full object-cover"
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
          loading && (
            <div className="w-full flex justify-center items-center text-muted-foreground">
              Missing Thumbnail
            </div>
          )
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-200 transform-gpu opacity-0",
              isMounted && "opacity-100",
              isClosing && "opacity-0"
            )}
            onClick={handleBackdropClick}
          >
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent z-[9999]">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="size-8 border-2 border-white/20">
                  <AvatarFallback>
                    {user.name?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-white font-medium">
                    @{user.username}
                  </span>
                  <span className="text-white/60 text-sm">
                    {format(fileMeta.createdAt, "MMM d, yyyy")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <SimpleTooltip content="Open in new tab">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    asChild
                  >
                    <Link href={url} target="_blank">
                      <ExternalLink className="size-5" />
                    </Link>
                  </Button>
                </SimpleTooltip>
                <SimpleTooltip content="Copy URL">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={() =>
                      copyWithToast(fullUrl, "URL copied to clipboard!")
                    }
                  >
                    <Link2 className="size-5" />
                  </Button>
                </SimpleTooltip>
                <SimpleTooltip content="Download">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    asChild
                  >
                    <Link href={url + "&download=true"} download>
                      <Download className="size-5" />
                    </Link>
                  </Button>
                </SimpleTooltip>
                <SimpleTooltip content="Close">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={handleClose}
                  >
                    <X className="size-5" />
                  </Button>
                </SimpleTooltip>
              </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl w-fit flex items-center justify-center">
              {isImage && (
                <img
                  src={url}
                  alt={`Image for ${getFileName(fileMeta)}`}
                  className="max-h-[85vh] w-auto object-contain"
                  draggable={false}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              )}
              {isVideo && (
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <FileVideoPlayer
                    url={url}
                    className="max-h-[85vh] w-auto rounded-none"
                  />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}