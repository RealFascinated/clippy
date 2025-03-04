import AvatarInitials from "@/components/avatar-initials";
import { getUser } from "@/lib/helpers/user";
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
        <span className="py-1.5 px-2 flex gap-1.5 items-center bg-secondary rounded-md cursor-pointer hover:opacity-80 transition-all transform-gpu">
          <AvatarInitials
            className="bg-zinc-900/75"
            name={user.username ?? "Minion Bob"}
            size="xs"
          />
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
