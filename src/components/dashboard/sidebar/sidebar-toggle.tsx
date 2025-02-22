"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function SidebarToggle() {
  const pathname = usePathname();
  if (!pathname.startsWith("/user/dashboard")) {
    return null;
  }

  return <SidebarTrigger />;
}
