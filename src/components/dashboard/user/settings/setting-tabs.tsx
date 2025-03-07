"use client";

import ConfigSettings from "@/components/dashboard/user/settings/config-settings";
import NotificationSettings from "@/components/dashboard/user/settings/notification-settings";
import PreferenceSettings from "@/components/dashboard/user/settings/preference-settings";
import UserSettings from "@/components/dashboard/user/settings/user-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const tabs = [
  {
    id: "user",
    name: "User",
    description: "Manage your account settings and preferences.",
    content: (user: UserType) => <UserSettings user={user} />,
  },
  {
    id: "config",
    name: "Config",
    description: "Manage your upload client configurations.",
    content: (user: UserType) => <ConfigSettings user={user} />,
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Manage your notification settings.",
    content: () => <NotificationSettings />,
  },
  {
    id: "preferences",
    name: "Preferences",
    description: "Manage your website preference settings.",
    content: (user: UserType) => <PreferenceSettings user={user} />,
  },
];

export default function SettingTabs({
  user,
  defaultTab,
}: {
  user: UserType;
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
        {tabs.map((tab) => (
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
      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          className="p-4 flex flex-col gap-4 bg-background/70 rounded-md border border-muted"
          value={tab.id}
        >
          {/* Tab Header */}
          <div className="flex flex-col gap-0.5 select-none">
            <h1 className="text-xl xs:text-2xl font-bold transition-all transform-gpu">
              {tab.name}
            </h1>
            <p className="text-sm xs:text-base text-muted-foreground transition-all transform-gpu">
              {tab.description}
            </p>
          </div>

          {/* Tab Content */}
          {tab.content(user)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
