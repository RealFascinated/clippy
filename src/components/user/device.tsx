import SimpleTooltip from "@/components/simple-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/client-auth";
import { Session } from "better-auth";
import { formatDistanceToNow } from "date-fns";
import { Monitor, Smartphone, X } from "lucide-react";
import Image from "next/image";
import { UAParser } from "ua-parser-js";

export default function Device({
  currentSession,
  session,
}: {
  currentSession: Session;
  session: Session;
}) {
  const isCurrentSession: boolean = currentSession.token === session.token;
  const { device, browser } = session.userAgent
    ? UAParser(session.userAgent)
    : { device: null, browser: null };
  const isMobile: boolean = device?.is("mobile") ?? false;
  let browserName: string = browser?.name ?? "An Unknown Browser";
  if (isMobile) {
    browserName = browserName.substring(6);
  }
  const name: string = `${isMobile ? "Mobile" : "Desktop"} Device on ${browser?.name ?? "An Unknown Browser"}`;

  async function logoutDevice() {
    await authClient.revokeSession({
      token: session.token,
    });
  }

  return (
    <>
      <div className="group relative p-2.5 w-full h-14 flex gap-3 items-center select-none">
        {/* Device & Browser Icons */}
        <SimpleTooltip content={name}>
          <div className="relative w-9 h-full flex justify-center items-center bg-muted rounded-full">
            {/* Device */}
            <div className="*:size-5">
              {isMobile ? <Smartphone /> : <Monitor />}
            </div>

            {/* Browser */}
            <Image
              className="absolute bottom-0 right-0 p-1 bg-muted rounded-full"
              src={`/browser/${browserName.toLowerCase()}.svg`}
              alt={browserName}
              width={20}
              height={20}
              draggable={false}
            />
          </div>
        </SimpleTooltip>

        <div className="flex flex-col gap-0.5">
          {/* Name & IP Address */}
          <div className="flex gap-2 items-center">
            <h1 className="text-sm font-medium">{name}</h1>

            {/* Current Session Badge */}
            {isCurrentSession && (
              <Badge className="py-0 text-xs">Current</Badge>
            )}
          </div>

          {/* IP Address & Login Date */}
          <div className="flex gap-1 items-center text-xs text-muted-foreground">
            {session.ipAddress} 🞄{" "}
            {formatDistanceToNow(session.createdAt, { addSuffix: true })}
          </div>
        </div>

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 ml-auto flex gap-2 items-center transition-all duration-300 transform-gpu">
          <SimpleTooltip
            content={<span className="text-destructive">Logout Device</span>}
          >
            <Button variant="ghost" size="icon" onClick={logoutDevice}>
              <X className="size-4 text-muted-foreground" />
            </Button>
          </SimpleTooltip>
        </div>
      </div>
      <Separator />
    </>
  );
}
