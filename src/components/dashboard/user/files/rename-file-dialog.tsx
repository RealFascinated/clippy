import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileType } from "@/lib/db/schemas/file";
import request from "@/lib/request";
import { ApiErrorResponse } from "@/type/api/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type RenameFileDialogProps = {
  fileMeta: FileType;
  children: ReactNode;
};

const formSchema = z.object({
  newId: z.string().min(1).max(32),
});

export default function RenameFileDialog({
  fileMeta,
  children,
}: RenameFileDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newId: fileMeta.id,
    },
  });

  async function onSubmit({ newId }: z.infer<typeof formSchema>) {
    try {
      await request.post(`/api/user/file/rename/${fileMeta.id}`, {
        throwOnError: true,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          id: newId,
        }),
      });
      toast.success("File renamed successfully");
    } catch (error) {
      toast.error(
        `Failed to rename file: ${(error as ApiErrorResponse).message}`
      );
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>Update the id of this file</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="newId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="text" placeholder="New ID" {...field} />
                      <span className="text-sm text-muted-foreground">
                        .{fileMeta.extension}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" variant="destructive">
                Rename
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
