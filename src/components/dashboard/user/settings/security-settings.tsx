"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Device from "@/components/user/device";
import { authClient } from "@/lib/client-auth";
import { UserSessionResponse } from "@/lib/helpers/user";
import { useQuery } from "@tanstack/react-query";
import { Session } from "better-auth";

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
  // Get the sessions using react query
  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => authClient.listSessions(),
  });

  return (
    <div className=" flex flex-col gap-2">
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
