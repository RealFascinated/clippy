"use client";

import { ReactNode, useEffect } from "react";

import { UserType } from "@/lib/db/schemas/auth-schema";
import { FileType } from "@/lib/db/schemas/file";
import { getFileName } from "@/lib/utils/file";
import { useState } from "react";
import { Download, ExternalLink, Link2, PlayIcon, X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn, copyWithToast } from "@/lib/utils/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FileVideoPlayer from "@/components/file/video-player";
import { env } from "@/lib/env";
import Loader from "@/components/ui/loader";

export default function FilePreview({
  fileMeta,
  user,
  className,
  children,
}: {
  fileMeta: FileType;
  user: UserType;
  className?: string;
  children: ReactNode;
}) {
  const url = `/${getFileName(fileMeta)}?incrementviews=false`;
  const isImage = fileMeta.mimeType.startsWith("image");
  const isVideo = fileMeta.mimeType.startsWith("video");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      <div
        className={cn("w-full h-full cursor-pointer", className)}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>

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
                      copyWithToast(
                        `${env.NEXT_PUBLIC_WEBSITE_URL}/${getFileName(fileMeta)}`,
                        "URL copied to clipboard!"
                      )
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
            <div className="relative max-w-7xl w-fit flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="size-10 animate-spin" />
                </div>
              )}

              {isImage && (
                <img
                  src={url}
                  alt={`Image for ${getFileName(fileMeta)}`}
                  className={cn(
                    "max-h-[85vh] w-auto object-contain",
                    isLoading && "opacity-0"
                  )}
                  draggable={false}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  onLoad={() => setIsLoading(false)}
                />
              )}
              {isVideo && (
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <FileVideoPlayer
                    url={url}
                    className={cn(
                      "max-h-[85vh] w-auto rounded-none",
                      isLoading && "opacity-0"
                    )}
                    onLoad={() => setIsLoading(false)}
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
