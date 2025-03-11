import { db } from "@/lib/db/drizzle";
import { users as usersTable } from "@/lib/db/schemas/auth-schema";
import { Command } from "commander";

const listUsersCommand = new Command("list-users")
  .description("Lists all users")
  .action(async () => {
    const users = await db.select().from(usersTable);

    for (const user of users) {
      console.log(
        `${user.username} (${user.name}) - ${user.email} (${user.role})`
      );
    }

    process.exit(0);
  });

export default listUsersCommand;
