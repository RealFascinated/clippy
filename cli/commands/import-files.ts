import { getFileById, uploadFile } from "@/lib/helpers/file";
import { getUserByName } from "@/lib/helpers/user";
import { type Props, print } from "bluebun";
import fs from "fs/promises";
import mime from "mime";
import path from "path";

const importFiles = {
  name: "import-files",
  description: "Migrates files from a directory to a users profile",
  run: async (props: Props) => {
    const { options } = props;
    const userName = options["user"]?.toString();
    const priovidedPath = options["path"]?.toString();

    // Validate options
    if (!userName) {
      return print(`Missing --user from the arguments.`);
    }
    if (!priovidedPath) {
      return print(`Missing --path from the arguments.`);
    }

    const user = await getUserByName(userName);
    if (!user) {
      print(
        `No users with the name ${userName} were found. (it is case-sensitive)`
      );
      process.exit(1);
    }

    const resolvedPath = path.resolve(priovidedPath);
    const stat = await fs.stat(resolvedPath).catch(err => {
      print(`The path ${priovidedPath} was not found.`, err);
      process.exit(1);
    });

    if (!stat.isDirectory()) {
      print(`The path ${priovidedPath} is not a directory.`);
      process.exit(1);
    }

    const files = await fs.readdir(resolvedPath);

    print(`Attempting to migrate ${files.length} files...`);

    let migrated = 0;
    for (const fileName of files) {
      const filePath = path.resolve(resolvedPath, fileName);
      const fileId = fileName.split(".")[0];

      const file = await getFileById(fileId);
      if (file) {
        print(`The file id ${fileId} already exists, skipping...`);
        continue;
      }

      const mimeType = mime.getType(filePath);
      if (mimeType == null) {
        print(
          `Unable to find a mime-type for the file ${filePath}, skipping...`
        );
        continue;
      }

      const buffer = await fs.readFile(filePath);
      const size = buffer.length;

      const fileStat = await fs.stat(filePath);
      const createdAt = fileStat.mtime;

      try {
        await uploadFile(
          fileId,
          fileName,
          size,
          buffer,
          mimeType,
          user,
          createdAt
        );
      } catch (err) {
        print(`Failed to migrate file ${filePath}`, err);
        continue;
      }

      print(`Migrated ${fileName} (${migrated}/${files.length})`);
      migrated++;
    }

    print(`Migrated ${migrated}/${files.length} files!`);
  },
};
export default importFiles;
