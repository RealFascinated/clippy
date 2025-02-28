import { getUser } from "@/lib/auth";
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
  const user = await getUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="py-1.5 px-2 bg-secondary rounded-md cursor-pointer hover:opacity-80 transition-all transform-gpu">
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
