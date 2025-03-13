"use client";

import ConfirmationPopover from "@/components/confirmation-popover";
import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Device from "@/components/user/device";
import { authClient } from "@/lib/client-auth";
import { UserSessionResponse } from "@/lib/helpers/user";
import { useQuery } from "@tanstack/react-query";
import { Session } from "better-auth";
import { LogOut } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export default function SecuritySettings({
  session,
}: {
  session: UserSessionResponse;
}) {
  return (
    <div className="flex flex-col gap-4">
      <DeviceList session={session} />
    </div>
  );
}

function DeviceList({
  session: currentSession,
}: {
  session: UserSessionResponse;
}) {
  const router: AppRouterInstance = useRouter();

  // Get the sessions using react query
  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => authClient.listSessions(),
  });

  const logoutAllDevices = async () => {
    await authClient.revokeSessions();
    router.refresh();
  };

  return (
    <div className="relative flex flex-col gap-2">
      {/* Header */}
      <div className="flex flex-col select-none">
        <h1 className="text-base xs:text-lg font-bold transition-all transform-gpu">
          Devices
        </h1>
        <p className="max-w-sm md:max-w-lg text-xs xs:text-sm text-muted-foreground transition-all transform-gpu">
          The current devices that are logged into your account.
        </p>
      </div>

      {/* Devices */}
      <div className="flex flex-col gap-2">
        {sessions?.data ? (
          sessions?.data
            ?.sort((a: Session, b: Session) => {
              // Sort by createdAt and make sure the current session is at the top
              if (a.token === currentSession.session.token) {
                return -1;
              }
              if (b.token === currentSession.session.token) {
                return 1;
              }
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            })
            .map((session: Session) => (
              <Device
                key={session.token}
                currentSession={currentSession.session}
                session={session}
              />
            ))
        ) : (
          <DevicesSkeleton />
        )}
      </div>

      {/* Logout All Button */}
      <SimpleTooltip content="Logout All Devices">
        <div>
          <ConfirmationPopover
            message="Are you sure you would like to logout all devices?"
            confirmationButton="Logout All"
            onConfirm={logoutAllDevices}
          >
            <Button
              className="lg:absolute right-0 top-0 w-fit"
              size="xs"
              variant="destructive"
            >
              <LogOut />
              Logout All Devices
            </Button>
          </ConfirmationPopover>
        </div>
      </SimpleTooltip>
    </div>
  );
}

function DevicesSkeleton() {
  return [...Array(5)].map((_, index) => (
    <Skeleton
      key={index}
      className="w-full h-14"
      style={{
        opacity: 1 - index * 0.35,
      }}
    />
  ));
}
