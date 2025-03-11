import { getFileById, uploadFileStream } from "@/lib/helpers/file";
import { getUserByName } from "@/lib/helpers/user";
import { thumbnailQueue } from "@/queue/queues";
import { Command } from "commander";
import { createReadStream } from "fs";
import fs from "fs/promises";
import mime from "mime";
import path from "path";

const migrateFilesCommand = new Command("migrate-files")
  .description("Migrates files from a directory to a users profile")
  .requiredOption("--user <username>", "Username to import files for")
  .requiredOption("--path <path>", "Path to directory containing files")
  .action(async (options) => {
    const userName = options.user;
    const providedPath = options.path;

    const user = await getUserByName(userName);
    if (!user) {
      console.log(
        `No users with the name ${userName} were found. (it is case-sensitive)`
      );
      process.exit(1);
    }

    const resolvedPath = path.resolve(providedPath);
    const stat = await fs.stat(resolvedPath).catch((err) => {
      console.log(`The path ${providedPath} was not found.`, err);
      process.exit(1);
    });

    if (!stat.isDirectory()) {
      console.log(`The path ${providedPath} is not a directory.`);
      process.exit(1);
    }

    const files = await fs.readdir(resolvedPath);

    console.log(`Attempting to migrate ${files.length} files...`);

    let migrated = 0;
    for (const fileName of files) {
      const filePath = path.resolve(resolvedPath, fileName);
      const fileId = fileName.split(".")[0];

      const file = await getFileById(fileId);
      if (file) {
        console.log(`The file id ${fileId} already exists, skipping...`);
        continue;
      }

      const mimeType = mime.getType(filePath);
      if (mimeType == null) {
        console.log(
          `Unable to find a mime-type for the file ${filePath}, skipping...`
        );
        continue;
      }

      // Get file stats to determine size and creation date
      const fileStat = await fs.stat(filePath);
      const size = fileStat.size;
      const createdAt = fileStat.mtime;

      // Create a file stream directly instead of reading into buffer
      const fileStream = createReadStream(filePath);

      try {
        const fileMeta = await uploadFileStream(
          fileId,
          fileName,
          size,
          fileStream,
          mimeType,
          user,
          createdAt
        );

        // Add to thumbnail queue
        thumbnailQueue.add(fileMeta);
      } catch (err) {
        console.log(`Failed to migrate file ${filePath}`, err);
        continue;
      }

      console.log(`Migrated ${fileName} (${migrated}/${files.length})`);
      migrated++;
    }

    console.log(`Migrated ${migrated}/${files.length} files!`);
    process.exit(0);
  });

export default migrateFilesCommand;
