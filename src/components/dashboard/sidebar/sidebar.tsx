import {
  Sidebar,
  SidebarContent,
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

export default function AppSidebar() {
  return (
    <Sidebar className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height))]">
      <SidebarContent className="gap-0">
        {groups.map((group, index) => {
          return (
            <SidebarGroup key={index}>
              {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
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
    </Sidebar>
  );
}
