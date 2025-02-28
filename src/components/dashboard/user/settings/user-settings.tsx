import AvatarInitials from "@/components/avatar-initials";
import { getUserRole } from "@/lib/helpers/role";
import { getUser } from "@/lib/helpers/user";
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
      <div>
        <AvatarInitials name={user.username} />
      </div>

      {/* Account Details */}
      <div className="relative w-full flex flex-col">
        {/* Name & Username */}
        <div className="flex gap-1.5 items-center">
          <span className="text-xl font-bold">{user.name}</span>
          <span className="text-sm text-muted-foreground">
            @{user.username}
          </span>
          <span className="block md:hidden text-sm text-muted-foreground">
            - {getUserRole(user).name} Account
          </span>
        </div>

        {/* Email & Creation Date */}
        <div className="flex flex-col text-sm text-muted-foreground">
          <span>{user.email}</span>

          {/* Creation Date & Role */}
          <div className="md:absolute md:right-0 md:bottom-0 flex flex-col md:items-end">
            <span className="hidden md:block">
              {getUserRole(user).name} Account
            </span>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
