import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";

type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <SidebarProvider className="flex flex-col [--header-height:48px]">
        <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
      </SidebarProvider>
    </QueryProvider>
  );
}
