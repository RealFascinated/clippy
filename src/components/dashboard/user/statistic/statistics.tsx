import { UserMetricsType } from "@/lib/db/schemas/metrics";
import { env } from "@/lib/env";
import request from "@/lib/request";
import { getValueFromKey } from "@/lib/utils/object";
import { formatBytes } from "@/lib/utils/utils";
import { ClockIcon, EyeIcon, FileIcon, ServerIcon } from "lucide-react";
import { headers } from "next/headers";
import { ReactElement } from "react";
import UserStatistic from "./statistic";

type Format = "number" | "bytes";
type Statistic = {
  key: string;
  name: string;
  format: Format;
  icon: ReactElement;
  tooltip?: (statistics: UserMetricsType) => string | ReactElement | undefined;
};

const statistics: Statistic[] = [
  {
    key: "userMetrics.uploads",
    name: "Total Uploads",
    format: "number",
    icon: <FileIcon className="size-5" />,
  },
  {
    key: "userMetrics.dailyUploads",
    name: "Uploads Today",
    format: "number",
    icon: <ClockIcon className="size-5" />,
  },
  {
    key: "storageMetrics.usedStorage",
    name: "Storage Used",
    format: "bytes",
    icon: <ServerIcon className="size-5" />,
    tooltip: (statistics) => {
      if (!statistics.storageMetrics) {
        return undefined;
      }

      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-semibold">File Usage</span>
            <span>{formatBytes(statistics.storageMetrics?.usedStorage)}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">Thumbnail Usage</span>
            <span>
              {formatBytes(statistics.storageMetrics?.thumbnailStorage)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "totalViews",
    name: "Total Views",
    format: "number",
    icon: <EyeIcon className="size-5" />,
  },
];

export default async function UserStatistics() {
  const statisticsResponse = await request.get<UserMetricsType>(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/statistics`,
    {
      headers: {
        cookie: (await headers()).get("cookie"),
      },
    }
  );

  if (!statisticsResponse) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full justify-between gap-4 items-center select-none">
      {statistics.map((statistic, index) => {
        const value = getValueFromKey(statisticsResponse, statistic.key);

        return (
          <UserStatistic
            key={index}
            name={statistic.name}
            icon={statistic.icon}
            format={statistic.format}
            value={value}
            tooltip={
              statistic.tooltip
                ? statistic.tooltip(statisticsResponse)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
