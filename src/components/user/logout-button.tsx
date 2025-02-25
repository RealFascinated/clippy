"use client";

import { authClient } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      className="cursor-pointer"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      Logout
    </DropdownMenuItem>
  );
}
