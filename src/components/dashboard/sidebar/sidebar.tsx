"use client";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Cog, Home, NotebookText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

type Item = {
  title: string;
  url: string;
  icon: ReactElement;
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
        icon: <Home />,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        url: "/dashboard/account/settings",
        icon: <Cog />,
      },
    ],
  },
];

const socials: Item[] = [
  {
    title: "GitHub",
    url: "https://github.com/RealFascinated/clippy",
    icon: <SiGithub />,
  },
  {
    title: "Documentation",
    url: "https://github.com/RealFascinated/clippy/wiki",
    icon: <NotebookText />,
  },
];

export default function AppSidebar() {
  const path: string = usePathname();
  const { isMobile } = useSidebar();

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
                    {group.items.map((item, index) => {
                      const active: boolean = path === item.url;
                      return (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton asChild>
                            <Link
                              className={cn(
                                active &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                              href={item.url}
                              prefetch={false}
                            >
                              <span className="*:size-4">{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>

        {/* Social Links */}
        <SidebarFooter className={cn("gap-0", !isMobile && "pb-14")}>
          {socials.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url} target="_blank" prefetch={false}>
                  <span className="*:size-4">{item.icon}</span>
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
