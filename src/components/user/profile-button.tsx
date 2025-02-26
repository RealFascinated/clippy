import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutButton from "./logout-button";

export default async function ProfileButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="py-1.5 px-2 bg-secondary rounded-md cursor-pointer">
          @{user.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/dashboard" prefetch={false}>
          <DropdownMenuItem className="cursor-pointer">
            Dashboard
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
