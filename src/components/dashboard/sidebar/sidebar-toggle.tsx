"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScreenSize, useIsScreenSize } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export default function SidebarToggle() {
  const isMobile = useIsScreenSize(ScreenSize.Medium);
  if (!isMobile) {
    return null;
  }

  const pathname = usePathname();
  if (!pathname.startsWith("/dashboard")) {
    return null;
  }

  return <SidebarTrigger />;
}
