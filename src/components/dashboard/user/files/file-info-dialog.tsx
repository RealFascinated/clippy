import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileType } from "@/lib/db/schemas/file";
import { DATE_FORMATS, formatDate } from "@/lib/utils/date";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { ReactNode } from "react";

type FileInfoDialogProps = {
  fileMeta: FileType;
  children: ReactNode;
};

export default function FileInfoDialog({
  fileMeta,
  children,
}: FileInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Information</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Name</span>
            <span className="text-sm text-muted-foreground">
              {getFileName(fileMeta)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Size</span>
            <span className="text-sm text-muted-foreground">
              {formatBytes(fileMeta.size)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Views</span>
            <span className="text-sm text-muted-foreground">
              {formatNumberWithCommas(fileMeta.views)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Uploaded</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(new Date(fileMeta.createdAt), DATE_FORMATS.DATE_TIME)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">MIME Type</span>
            <span className="text-sm text-muted-foreground">
              {fileMeta.mimeType}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
