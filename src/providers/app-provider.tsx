"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode, useEffect } from "react";
import { QueryProvider } from "./query-provider";

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  // Only prevent default if not triggered from a custom context menu
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('[role="menu"]')) {
        event.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <QueryProvider>
      <SidebarProvider className="flex flex-col [--header-height:48px]">
        <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
      </SidebarProvider>
    </QueryProvider>
  );
}
