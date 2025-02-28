import { roleExists, Roles } from "@/lib/helpers/role";
import { getUserByName, updateUser } from "@/lib/helpers/user";
import { type Props, print } from "bluebun";

export default {
  name: "change-user-role",
  description: "Changes the role for a user",
  run: async (props: Props) => {
    const { options } = props;
    const userName = options["user"]?.toString();
    const roleName = options["role"]?.toString() as Roles;

    // Validate options
    if (!userName) {
      return print(`Missing --user from the arguments.`);
    }
    if (!roleName) {
      return print(`Missing --role from the arguments.`);
    }

    const user = await getUserByName(userName);
    if (!user) {
      print(
        `No users with the name "${userName}" were found. (it is case-sensitive)`
      );
      process.exit(1);
    }

    if (!roleExists(roleName)) {
      return print(`The role "${roleName}" does not exist.`);
    }

    // Change user's role
    await updateUser(user.id, {
      role: roleName,
    });

    print(`Successfully changed the role for "${userName}" to "${roleName}"`);
  },
};
