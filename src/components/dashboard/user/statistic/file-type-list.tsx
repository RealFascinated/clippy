import { MimetypeDistribution } from "@/type/api/user/mimetype-distrubution";

type FileTypeListProps = {
  mimetypeDistribution: MimetypeDistribution;
};

export default function FileTypeList({
  mimetypeDistribution,
}: FileTypeListProps) {
  return (
    <div className="w-full h-[250px] md:h-[350px] p-4 bg-background/70 rounded-md border border-muted overflow-y-auto flex flex-col gap-2">
      <span className="font-semibold">File Types</span>
      <ul className="grid grid-cols-1">
        {Object.entries(mimetypeDistribution).map(([key, value]) => (
          <li
            key={key}
            className="flex justify-between items-center px-1 py-1 rounded-sm hover:bg-muted/50"
          >
            <span className="font-medium">{key}</span>
            <span className="text-muted-foreground">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
