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
  file: FileType;
  refetch: () => Promise<void>;
};

export default function UserFile({ file, refetch }: UserFileProps) {
  const hasThumbnail = file.mimeType.startsWith("video") || file.mimeType.startsWith("image");

  return (
    <div className="bg-card h-54 flex flex-col items-center p-2 rounded-md">
      {/* File Name */}
      <span>{getFileName(file)}</span>

      {/* Preview */}
      <div className="flex-1 flex items-center">
        {hasThumbnail ? (
          <FilePreview file={file} />
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-16">
              <FileExtensionIcon extension={file.extension} />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-2 items-center">
        {/* File Size */}
        <span>{formatBytes(file.size)}</span>

        {/* Download File */}
        <Link
          href={`/${getFileName(file)}?incrementviews=false&download=true`}
          prefetch={false}
        >
          <DownloadIcon className="size-4.5" />
        </Link>

        {/* Delete File Button */}
        <DeleteFileDialog file={file} refetch={refetch} />
      </div>
    </div>
  );
}

function FilePreview({ file }: { file: FileType }) {
  const thumbnailUrl = `/thumbnail/${file.thumbnailId}.${file.thumbnailExtension}`;
  const url = `/${getFileName(file)}`;
  const isImage = file.mimeType.startsWith("image");
  const isVideo = file.mimeType.startsWith("video");

  return (
    <Dialog>
      <DialogTrigger className="relative">
        <img src={thumbnailUrl} alt="Recent File Image Preview" className="transparent max-h-36" />
        {file.mimeType.startsWith("video") && (
          <PlayIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10" />
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>
            {file.id}.{file.extension}
          </DialogTitle>
        </DialogHeader>
        {isImage && <img src={url} alt={`Image for ${getFileName(file)}`} />}

        {isVideo && <video src={url} controls autoPlay />}
      </DialogContent>
    </Dialog>
  );
}

function DeleteFileDialog({ file, refetch }: UserFileProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  /**
   * Deletes a file
   *
   * @param file the file to delete
   */
  async function deleteFile(file: FileType) {
    try {
      await request.get(`/api/user/file/delete/${file.deleteKey}`, {
        throwOnError: true,
        withCredentials: true, // use cookies
      });
      await refetch();
      toast(`Successfully deleted ${getFileName(file)}!`);
    } catch {
      toast(`Failed to delete ${getFileName(file)}`);
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
            This will delete the file <InlineCodeBlock>{getFileName(file)}</InlineCodeBlock>, this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button className="w-fit" variant="destructive" onClick={() => deleteFile(file)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
