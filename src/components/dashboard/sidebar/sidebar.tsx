import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Cog, Home } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

type Item = {
  title: string;
  url: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
};

type Group = {
  title?: string;
  items: Item[];
};

const groups: Group[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        url: "/dashboard/account/settings",
        icon: Cog,
      },
    ],
  },
];

const socials: Item[] = [
  {
    title: "GitHub",
    url: "https://github.com/RealFascinated/clippy",
    icon: Cog,
  },
  {
    title: "Documentation",
    url: "https://github.com/RealFascinated/clippy/wiki",
    icon: Cog,
  },
];

export default function AppSidebar() {
  return (
    <div className="h-[90vh] overflow-hidden">
      <Sidebar className="top-[var(--header-height)] select-none">
        {/* Groups */}
        <SidebarContent className="gap-0 justify-be">
          {groups.map((group, index) => {
            return (
              <SidebarGroup key={index}>
                {group.title && (
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} prefetch={false}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>

        <SidebarFooter className="pb-20 gap-0">
          {socials.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url} prefetch={false}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
