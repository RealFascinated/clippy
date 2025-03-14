"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { getShortenedUrlLink } from "@/lib/utils/shortened-urls";
import { copyWithToast } from "@/lib/utils/utils";
import { IdCard, Link, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import DeleteShortUrlDialog from "./delete-short-url-dialog";
import { UserShortUrlProps } from "./short-url";

type ShortUrlContextMenuProps = UserShortUrlProps & {
  children: ReactNode;
};

export default function ShortUrlContextMenu({
  link,
  refetch,
  children,
}: ShortUrlContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem
          onClick={() =>
            copyWithToast(
              getShortenedUrlLink(link.id),
              "Copied the link to your clipboard"
            )
          }
        >
          Copy URL <Link />
        </ContextMenuItem>
        <DeleteShortUrlDialog link={link} refetch={refetch}>
          <ContextMenuItem variant="destructive">
            Delete <Trash2 />
          </ContextMenuItem>
        </DeleteShortUrlDialog>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() =>
            copyWithToast(
              link.id,
              "Copied the id for this link to your clipboard"
            )
          }
        >
          Copy ID <IdCard />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
