import AvatarInitials from "@/components/avatar-initials";
import { getUser } from "@/lib/auth";
import { format } from "date-fns";

export default async function UserSettings() {
  const user = await getUser();
  return (
    <div className="flex flex-col gap-4">
      <UserDetails user={user} />
    </div>
  );
}

function UserDetails({ user }: { user: any }) {
  const createdAt = `Created on ${format(user.createdAt, "MMM dd, yyyy")}`;
  return (
    <div className="flex gap-3 items-center select-none">
      {/* Avatar */}
      <AvatarInitials name={user.username} />

      {/* Details */}
      <div className="relative w-full flex flex-col">
        {/* Name & Username */}
        <div className="flex gap-1.5 items-center">
          <span className="text-xl font-bold">{user.name}</span>
          <span className="text-sm text-muted-foreground">
            @{user.username}
          </span>
        </div>

        {/* Email & Creation Date */}
        <div className="flex flex-col text-sm text-muted-foreground">
          <span>{user.email}</span>
          <span className="sm:hidden text-xs">{createdAt}</span>

          <span className="hidden sm:block absolute right-0 top-0">
            {createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}
