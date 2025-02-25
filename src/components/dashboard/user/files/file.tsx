import FileExtensionIcon from "@/components/file-icon";
import { Button } from "@/components/ui/button";
import { InlineCodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileType } from "@/lib/db/schemas/file";
import request from "@/lib/request";
import { getFileName } from "@/lib/utils/file";
import { formatBytes } from "@/lib/utils/utils";
import { DownloadIcon, PlayIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type UserFileProps = {
  fileMeta: FileType;
  refetch: () => Promise<void>;
};

export default function UserFile({ fileMeta, refetch }: UserFileProps) {
  const hasThumbnail =
    fileMeta.mimeType.startsWith("video") ||
    fileMeta.mimeType.startsWith("image");

  return (
    <div className="bg-card h-54 flex flex-col items-center p-2 rounded-md">
      {/* File Name */}
      <span>{getFileName(fileMeta)}</span>

      {/* Preview */}
      <div className="flex-1 flex items-center">
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

      {/* Stats */}
      <div className="flex gap-2 items-center">
        {/* File Size */}
        <span>{formatBytes(fileMeta.size)}</span>

        {/* Download File */}
        <Link
          href={`/${getFileName(fileMeta)}?incrementviews=false&download=true`}
          prefetch={false}
        >
          <DownloadIcon className="size-4.5" />
        </Link>

        {/* Delete File Button */}
        <DeleteFileDialog fileMeta={fileMeta} refetch={refetch} />
      </div>
    </div>
  );
}

function FilePreview({ fileMeta }: { fileMeta: FileType }) {
  const url = `/${getFileName(fileMeta)}`;
  const isImage = fileMeta.mimeType.startsWith("image");
  const isVideo = fileMeta.mimeType.startsWith("video");

  return (
    <Dialog>
      <DialogTrigger className="relative cursor-pointer">
        <img
          src={`/thumbnails/${fileMeta.thumbnailId}.${fileMeta.thumbnailExtension}`}
          alt="Recent File Image Preview"
          className="transparent max-h-36"
        />
        {fileMeta.mimeType.startsWith("video") && (
          <PlayIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10" />
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>{getFileName(fileMeta)}</DialogTitle>
        </DialogHeader>
        {isImage && (
          <img src={url} alt={`Image for ${getFileName(fileMeta)}`} />
        )}

        {isVideo && <video src={url} controls autoPlay />}
      </DialogContent>
    </Dialog>
  );
}

function DeleteFileDialog({ fileMeta, refetch }: UserFileProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  /**
   * Deletes a file
   *
   * @param fileMeta the file to delete
   */
  async function deleteFile(fileMeta: FileType) {
    try {
      await request.get(`/api/user/file/delete/${fileMeta.deleteKey}`, {
        throwOnError: true,
        withCredentials: true, // use cookies
      });
      await refetch();
      toast(`Successfully deleted ${getFileName(fileMeta)}!`);
    } catch {
      toast(`Failed to delete ${getFileName(fileMeta)}`);
    }
    setDeleteConfirm(false);
  }

  return (
    <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
      <DialogTrigger asChild>
        <button className="cursor-pointer">
          <TrashIcon className="size-4 text-red-400" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will delete the file{" "}
            <InlineCodeBlock>{getFileName(fileMeta)}</InlineCodeBlock>, this
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="w-fit"
            variant="destructive"
            onClick={() => deleteFile(fileMeta)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
