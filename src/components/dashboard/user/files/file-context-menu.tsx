"use client";

import DeleteFileDialog from "@/components/dashboard/user/files/delete-file-dialog";
import { UserFileProps } from "@/components/dashboard/user/files/file";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { copyFileUrl } from "@/lib/file";
import { getFileName } from "@/lib/utils/file";
import { copyWithToast } from "@/lib/utils/utils";
import { Download, IdCard, Info, Link, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type FileContextMenuProps = UserFileProps & {
  children: ReactNode;
};

export default function FileContextMenu({
  fileMeta,
  refetch,
  children,
}: FileContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onClick={() => copyFileUrl(fileMeta)}>
          Copy URL <Link />
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => redirect(`/${getFileName(fileMeta)}?download=true`)}
        >
          Download <Download />
        </ContextMenuItem>

        <ContextMenuSeparator />
        <DeleteFileDialog fileMeta={fileMeta} refetch={refetch}>
          <ContextMenuItem variant="destructive">
            Delete <Trash2 />
          </ContextMenuItem>
        </DeleteFileDialog>

        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => copyWithToast(fileMeta.id, "Copied the id for this file to your clipboard")}>
          Copy ID <IdCard />
        </ContextMenuItem>
        <ContextMenuItem>
          Info <Info />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
