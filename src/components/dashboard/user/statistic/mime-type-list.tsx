import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { MimetypeDistribution } from "@/type/api/user/mimetype-distrubution";
import { FileType } from "lucide-react";
import Link from "next/link";

type MimeTypeListProps = {
  mimetypeDistribution: MimetypeDistribution;
};

export default function MimeTypeList({
  mimetypeDistribution,
}: MimeTypeListProps) {
  return (
    <div className="w-full h-[400px] flex flex-col">
      <div className="px-6 py-4 border-b border-muted/10">
        <div className="flex items-center gap-2">
          <FileType className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">File Types</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Distribution of your uploaded files by type
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {Object.entries(mimetypeDistribution).length > 0 ? (
          <>
            <div className="px-6 py-3 border-b border-muted/10 shrink-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Type
                </div>
                <div className="text-sm font-medium text-muted-foreground text-right">
                  Count
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-4">
              <div className="space-y-1 py-2">
                {Object.entries(mimetypeDistribution).map(([key, value]) => (
                  <Link
                    href={`/dashboard/files?search=${key}`}
                    key={key}
                    prefetch={false}
                    className="block"
                  >
                    <div className="grid grid-cols-2 gap-4 py-2 px-2 rounded-lg hover:bg-muted/20 transition-all duration-200">
                      <div className="text-sm font-medium truncate">{key}</div>
                      <div className="text-sm text-muted-foreground text-right font-medium">
                        {formatNumberWithCommas(value)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <FileType className="size-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No file types</p>
            <p className="text-xs">Upload some files to see their types here</p>
          </div>
        )}
      </div>
    </div>
  );
}
