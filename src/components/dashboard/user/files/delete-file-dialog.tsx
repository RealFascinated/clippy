import { UserFileProps } from "@/components/dashboard/user/files/file";
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
import { ReactNode, useState } from "react";
import { toast } from "sonner";

type DeleteFileDialogProps = UserFileProps & {
  children: ReactNode;
};

export default function DeleteFileDialog({
  fileMeta,
  refetch,
  children,
}: DeleteFileDialogProps) {
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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
