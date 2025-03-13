import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { MimetypeDistribution } from "@/type/api/user/mimetype-distrubution";
import Link from "next/link";

type FileTypeListProps = {
  mimetypeDistribution: MimetypeDistribution;
};

export default function FileTypeList({
  mimetypeDistribution,
}: FileTypeListProps) {
  return (
    <div className="w-full xl:w-[1000px] h-[350px] bg-background/70 rounded-lg border border-muted shadow-sm flex flex-col">
      <div className="p-3 border-b border-muted shrink-0">
        <h2 className="text-lg font-semibold">File Types</h2>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-muted/50 shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Type
            </div>
            <div className="text-sm font-medium text-muted-foreground text-right">
              Count
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          <div className="space-y-1">
            {Object.entries(mimetypeDistribution).map(([key, value]) => (
              <Link
                href={`/dashboard/files?search=${key}`}
                key={key}
                prefetch={false}
                className="block"
              >
                <div className="grid grid-cols-2 gap-4 py-2 px-1 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="text-sm truncate">{key}</div>
                  <div className="text-sm text-muted-foreground text-right">
                    {formatNumberWithCommas(value)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
