import { FileIcon } from "react-file-icon";

const FileExtensionIcon = ({ extension }: { extension: string }) => {
  return <FileIcon {...{ extension }} />;
};

export default FileExtensionIcon;
