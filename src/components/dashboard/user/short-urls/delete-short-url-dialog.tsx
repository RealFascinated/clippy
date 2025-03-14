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
import { ShortenedUrlType } from "@/lib/db/schemas/shortened-urls";
import request from "@/lib/request";
import { ReactNode } from "react";
import { toast } from "sonner";
import { UserShortUrlProps } from "./short-url";

type DeleteShortUrlDialogProps = UserShortUrlProps & {
  children: ReactNode;
};

export default function DeleteShortUrlDialog({
  link,
  refetch,
  children,
}: DeleteShortUrlDialogProps) {
  /**
   * Deletes a short link
   *
   * @param link the short link to delete
   */
  async function deleteShortLink(link: ShortenedUrlType) {
    try {
      await request.get(`/api/shorten/delete/${link.deleteKey}`, {
        throwOnError: true,
        withCredentials: true, // use cookies
      });
      await refetch();
      toast(`Successfully deleted the short link ${link.id}!`);
    } catch {
      toast(`Failed to delete the short link ${link.id}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will delete the short link{" "}
            <InlineCodeBlock>{link.id}</InlineCodeBlock>, this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="w-fit"
            variant="destructive"
            onClick={() => deleteShortLink(link)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
