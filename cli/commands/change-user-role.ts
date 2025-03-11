import { roleExists, Roles } from "@/lib/helpers/role";
import { getUserByName, updateUser } from "@/lib/helpers/user";
import { Command } from "commander";

const updateUserRoleCommand = new Command("update-user-role")
  .description("Changes the role for a user")
  .requiredOption("--user <username>", "Username to change role for")
  .requiredOption("--role <role>", "New role to assign")
  .action(async options => {
    const userName = options.user;
    const roleName = options.role as Roles;

    const user = await getUserByName(userName);
    if (!user) {
      console.log(
        `No users with the name "${userName}" were found. (it is case-sensitive)`
      );
      process.exit(1);
    }

    if (!roleExists(roleName)) {
      console.log(`The role "${roleName}" does not exist.`);
      process.exit(1);
    }

    // Change user's role
    await updateUser(user.id, {
      role: roleName,
    });

    console.log(
      `Successfully changed the role for "${userName}" to "${roleName}"`
    );
    process.exit(0);
  });

export default updateUserRoleCommand;
