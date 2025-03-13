"use client";

import AppearanceSettings from "@/components/dashboard/user/settings/appearance-settings";
import ConfigSettings from "@/components/dashboard/user/settings/config-settings";
import NotificationSettings from "@/components/dashboard/user/settings/notification-settings";
import SecuritySettings from "@/components/dashboard/user/settings/security-settings";
import UserSettings from "@/components/dashboard/user/settings/user-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSessionResponse } from "@/lib/helpers/user";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const tabs = [
  {
    id: "user",
    name: "User",
    description: "Manage your account settings and preferences.",
    content: (session: UserSessionResponse) => (
      <UserSettings user={session.user} />
    ),
  },
  {
    id: "security",
    name: "Security",
    description: "Manage the security of your account.",
    content: (session: UserSessionResponse) => (
      <SecuritySettings session={session} />
    ),
  },
  {
    id: "config",
    name: "Config",
    description: "Manage your upload client configurations.",
    content: (session: UserSessionResponse) => (
      <ConfigSettings user={session.user} />
    ),
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Manage your notification settings.",
    content: () => <NotificationSettings />,
  },
  {
    id: "appearance",
    name: "Appearance",
    description: "Manage your website appearance settings.",
    content: (session: UserSessionResponse) => (
      <AppearanceSettings user={session.user} />
    ),
  },
];

export default function SettingTabs({
  session,
  defaultTab,
}: {
  session: UserSessionResponse;
  defaultTab: string | undefined;
}) {
  const router: AppRouterInstance = useRouter();

  return (
    <Tabs
      defaultValue={defaultTab ?? tabs[0].id}
      onValueChange={(tab: string) =>
        router.push(`/dashboard/account/settings/${tab}`)
      }
    >
      {/* Headers */}
      <TabsList className="w-full h-full flex flex-wrap bg-transparent rounded-sm">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.id}
            className="flex-1 min-w-24 border-b border-border data-[state=active]:border-primary/75 data-[state=active]:text-primary rounded-none hover:opacity-75 cursor-pointer transition-all transform-gpu"
            value={tab.id}
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content */}
      {tabs.map(tab => (
        <TabsContent
          key={tab.id}
          className="p-6 flex flex-col gap-6 bg-background/70 rounded-md border border-muted/50"
          value={tab.id}
        >
          {/* Tab Header */}
          <div className="flex flex-col gap-1 select-none">
            <h1 className="text-xl xs:text-2xl font-bold transition-all transform-gpu">
              {tab.name}
            </h1>
            <p className="text-sm xs:text-md text-muted-foreground transition-all transform-gpu">
              {tab.description}
            </p>
          </div>

          {/* Tab Content */}
          {tab.content(session)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
