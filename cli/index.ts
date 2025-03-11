import { Command } from "commander";
import updateUserRoleCommand from "./commands/change-user-role";
import migrateFilesCommand from "./commands/import-files";
import listUsersCommand from "./commands/list-users";

const program = new Command();

program
  .name("clippy")
  .description("Clippy CLI tool")
  .version("1.0.0")
  .addCommand(updateUserRoleCommand)
  .addCommand(migrateFilesCommand)
  .addCommand(listUsersCommand);

program.parse();
