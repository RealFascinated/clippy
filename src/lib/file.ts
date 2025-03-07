import { FileType } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { getFileName } from "@/lib/utils/file";
import { copyWithToast } from "@/lib/utils/utils";

export function copyFileUrl(file: FileType) {
  copyWithToast(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/${getFileName(file)}`,
    `Copied the url for ${getFileName(file)} to your clipboard`
  );
}
