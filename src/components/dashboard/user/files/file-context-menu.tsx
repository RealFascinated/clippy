import DeleteFileDialog from "@/components/dashboard/user/files/delete-file-dialog";
import { UserFileProps } from "@/components/dashboard/user/files/file";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Download, IdCard, Info, Link, Trash2 } from "lucide-react";
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
        <ContextMenuItem>
          Copy URL <Link />
        </ContextMenuItem>
        <ContextMenuItem>
          Download <Download />
        </ContextMenuItem>
        <ContextMenuSeparator />
        <DeleteFileDialog fileMeta={fileMeta} refetch={refetch}>
          <ContextMenuItem>
            Delete <Trash2 />
          </ContextMenuItem>
        </DeleteFileDialog>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Copy ID <IdCard />
        </ContextMenuItem>
        <ContextMenuItem>
          Info <Info />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
