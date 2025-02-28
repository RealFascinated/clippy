"use client";

import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Request from "@/lib/request";
import { cn } from "@/lib/utils/utils";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfigSettings({ user }: { user: any }) {
  return (
    <div className="flex flex-col gap-6">
      <UploadToken user={user} />
      <DownloadConfig hasUploadToken={!!user.uploadToken} />
    </div>
  );
}

function UploadToken({ user }: { user: any }) {
  const router: AppRouterInstance = useRouter();
  const hasUploadToken = !!user.uploadToken;

  async function resetToken(): Promise<void> {
    await Request.post("/api/user/reset-upload-token");
    router.refresh();
    toast("Your upload token has been rotated!");
  }

  function copyToken() {
    if (!hasUploadToken) toast("You do not have an upload token");
    else {
      toast("Copied your upload token to your clipboard");
      navigator.clipboard.writeText(user.uploadToken);
    }
  }

  const noUploadToken = (
    <div className="flex gap-2.5 items-center">
      <span className="text-destructive">
        You don&apos;t have an upload token.
      </span>
      <Button
        className="h-5 text-xs bg-zinc-900 border-black/15 hover:bg-zinc-900/75 transition-all transform-gpu"
        size="sm"
        variant="outline"
        onClick={resetToken}
      >
        Create One
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-muted-foreground select-none">
        Upload Token
      </span>
      <div className="relative">
        <CodeBlock
          className="group"
          codeClassName={cn(
            "text-sm",
            hasUploadToken &&
              "blur-xs group-hover:blur-none transition-all transform-gpu"
          )}
        >
          <span>{user.uploadToken ?? noUploadToken}</span>
        </CodeBlock>
        {hasUploadToken && (
          <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex gap-1.5 items-center">
            {/* Reset Token */}
            <SimpleTooltip content="Rotate Upload Token">
              <div>
                <ResetTokenDialog resetToken={resetToken} />
              </div>
            </SimpleTooltip>

            <Button
              className="size-7 text-muted-foreground hover:text-muted-foreground/75 transition-all transform-gpu"
              variant="outline"
              onClick={copyToken}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Warning */}
      <span className="text-xs text-muted-foreground/75 select-none">
        This is meant to be kept a secret, Do{" "}
        <b>
          <u className="text-sm">NOT</u>
        </b>{" "}
        share it with anyone!
      </span>
    </div>
  );
}

function ResetTokenDialog({ resetToken }: { resetToken: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="size-7 text-muted-foreground hover:text-muted-foreground/75 transition-all transform-gpu"
          variant="outline"
        >
          <RefreshCw className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. You will need to update your upload
            token on ShareX.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-fit"
              variant="destructive"
              onClick={resetToken}
            >
              Reset
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DownloadConfig({ hasUploadToken }: { hasUploadToken: boolean }) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = () => {
    if (!hasUploadToken) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };
  return (
    <SimpleTooltip
      content={
        !hasUploadToken ? "No upload token, create one first!" : undefined
      }
    >
      <Link
        className={cn("w-fit", !hasUploadToken && "!cursor-not-allowed")}
        href={hasUploadToken ? "/api/user/config/sharex" : "#"}
        prefetch={false}
        draggable={false}
      >
        <Button disabled={loading || !hasUploadToken} onClick={handleDownload}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Image
                src="/sharex.svg"
                alt="ShareX Logo"
                width={16}
                height={16}
              />
              Download Config
            </>
          )}
        </Button>
      </Link>
    </SimpleTooltip>
  );
}
