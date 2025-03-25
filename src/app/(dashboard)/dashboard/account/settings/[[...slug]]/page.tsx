import SettingTabs from "@/components/dashboard/user/settings/setting-tabs";
import { getUserSession, UserSessionResponse } from "@/lib/helpers/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function AccountSettingsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const session: UserSessionResponse | null = await getUserSession();
  const selectedTab: string | undefined = (await params).slug?.[0];

  return (
    <div className="mx-auto w-full max-w-5xl self-start flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1.5 select-none">
        <h1 className="text-xl xs:text-2xl font-bold transition-all transform-gpu">
          Account Settings
        </h1>
        <p className="text-sm xs:text-base text-muted-foreground transition-all transform-gpu">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Settings */}
      {session && <SettingTabs session={session} defaultTab={selectedTab} />}
    </div>
  );
}
