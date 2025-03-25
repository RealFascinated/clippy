import AvatarInitials from "@/components/avatar-initials";
import { getUser } from "@/lib/helpers/user";
import { Settings, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LogoutButton from "./logout-button";

export default async function ProfileButton() {
  const user = await getUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors px-2 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground">
          <AvatarInitials
            className="size-6 bg-primary/10 text-primary"
            name={user.username ?? "Minion Bob"}
            size="sm"
          />
          <span className="max-w-[80px] sm:max-w-none truncate">
            @{user.username}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard" prefetch={false}>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 size-4" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/account/settings/user" prefetch={false}>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
