import { Command } from "commander";
import listUsersCommand from "./commands/list-users";
import migrateFilesCommand from "./commands/migrate-files";
import updateUserRoleCommand from "./commands/update-user-role";

const program = new Command();

program
  .name("clippy")
  .description("Clippy CLI tool")
  .version("1.0.0")
  .addCommand(updateUserRoleCommand)
  .addCommand(migrateFilesCommand)
  .addCommand(listUsersCommand);

program.parse();
