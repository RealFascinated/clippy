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
import { formatBytes, getFileExtension } from "@/lib/utils";
import { getFileFullName } from "@/lib/utils/file";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type UserFileProps = {
  file: FileType;
  refetch: () => Promise<void>;
};

export default function UserFile({ file, refetch }: UserFileProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  const fileUrl = `/${getFileFullName(file)}`;

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
      toast(`Successfully deleted ${getFileFullName(file)}!`);
    } catch (err) {
      toast(`Failed to delete ${getFileFullName(file)}`);
    }
    setDeleteConfirm(false);
  }

  return (
    <div className="bg-card h-48 flex flex-col items-center p-2 rounded-md">
      <Link href={fileUrl} className="flex-1 flex items-center">
        <img
          src={`${fileUrl}?incrementviews=false`}
          alt="Recent File Image Preview"
          className="transparent max-h-36"
        />
      </Link>
      <div className="flex gap-2 items-center">
        {/* File Size */}
        <span>{formatBytes(file.size)}</span>

        {/* Delete File Button */}
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
                <InlineCodeBlock>{getFileFullName(file)}</InlineCodeBlock>, this
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                className="w-fit"
                variant="destructive"
                onClick={() => deleteFile(file)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
