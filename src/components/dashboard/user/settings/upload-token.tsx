"use client";

import { CodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Request from "@/lib/request";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardTitle } from "../../../ui/card";

type UploadTokenProps = {
  uploadToken?: string | null;
};

export default function UploadToken({ uploadToken }: UploadTokenProps) {
  const router = useRouter();
  const [resetTokenConfirmOpen, setResetTokenConfirmOpen] =
    useState<boolean>(false);

  async function resetToken() {
    await Request.post("/api/user/reset-upload-token");
    router.refresh();
    setResetTokenConfirmOpen(false);

    toast("You have reset your upload token");
  }

  function copyToken() {
    if (!uploadToken) {
      toast("You do not have an upload token");
      return;
    }

    toast("Copied your upload token to your clipboard");
    navigator.clipboard.writeText(uploadToken);
  }

  return (
    <Card className="w-full">
      <CardTitle>Upload Token</CardTitle>
      <CardContent className="p-3">
        {uploadToken !== null ? (
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">
              This is your upload token. Do NOT share it with anyone!
            </span>
            <CodeBlock
              className="group"
              codeClassName="blur-xs group-hover:blur-none transition-all transform-gpu"
            >
              <span>{uploadToken}</span>
            </CodeBlock>

            {/* Buttons */}
            <div className="flex gap-2">
              {/* Reset Upload Token */}
              <Dialog
                open={resetTokenConfirmOpen}
                onOpenChange={setResetTokenConfirmOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-fit" variant="destructive">
                    Reset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. You will need to update your
                      upload token on ShareX.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button
                      className="w-fit"
                      variant="destructive"
                      onClick={() => resetToken()}
                    >
                      Reset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Copy Upload Token */}
              <Button onClick={() => copyToken()} className="w-fit">
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">
              You do not have an upload token. Please create one.
            </span>

            {/* Create Upload Token */}
            <Button onClick={() => resetToken()} className="w-fit">
              Create
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
