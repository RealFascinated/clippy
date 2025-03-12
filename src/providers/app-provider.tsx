"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode, useEffect, useState } from "react";
import { QueryProvider } from "./query-provider";
import { isProduction } from "@/lib/utils/utils";

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  const [isEnvLoaded, setIsEnvLoaded] = useState(!isProduction());

  useEffect(() => {
    if (isProduction()) {
      const checkEnv = () => {
        if (window.__ENV) {
          setIsEnvLoaded(true);
        } else {
          setTimeout(checkEnv, 10);
        }
      };
      checkEnv();
    }
  }, []);

  // Only prevent default if not triggered from a custom context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-custom-context-menu]")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (!isEnvLoaded) {
    return null; // or a loading spinner
  }

  return (
    <TooltipProvider>
      <QueryProvider>
        <SidebarProvider className="flex flex-col [--header-height:48px]">
          {children}
        </SidebarProvider>
      </QueryProvider>
    </TooltipProvider>
  );
}
