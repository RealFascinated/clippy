"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScreenSize, useIsScreenSize } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export default function SidebarToggle() {
  const pathname = usePathname();
  const isMobile = useIsScreenSize(ScreenSize.Medium);
  if (!isMobile) {
    return null;
  }

  if (!pathname.startsWith("/dashboard")) {
    return null;
  }

  return <SidebarTrigger />;
}
