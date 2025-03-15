import { UserMetricsType } from "@/lib/db/schemas/metrics";
import { getValueFromKey } from "@/lib/utils/object";
import { formatBytes } from "@/lib/utils/utils";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { getDateString } from "@/lib/utils/date";
import { ClockIcon, EyeIcon, FileIcon, ServerIcon } from "lucide-react";
import { ReactElement } from "react";
import UserStatistic from "./statistic/statistic";

type Format = "number" | "bytes";

type StatisticConfig = {
  name: string;
  icon: ReactElement;
  key: string;
  format: Format;
  tooltip?: (metrics: UserMetricsType) => string;
};

type StatisticsProps = {
  statisticsResponse: UserStatisticsResponse;
};

const statistics: StatisticConfig[] = [
  {
    name: "Storage Used",
    icon: <ServerIcon className="size-4 text-primary" />,
    key: "storageMetrics.usedStorage",
    format: "bytes",
  },
  {
    name: "Total Files",
    icon: <FileIcon className="size-4 text-primary" />,
    key: "userMetrics.uploads",
    format: "number",
  },
  {
    name: "Total Views",
    icon: <EyeIcon className="size-4 text-primary" />,
    key: "fileMetrics.views",
    format: "number",
  },
  {
    name: "Daily Views",
    icon: <ClockIcon className="size-4 text-primary" />,
    key: "fileMetrics.dailyViews",
    format: "number",
  },
];

export default function Statistics({ statisticsResponse }: StatisticsProps) {
  const statisticsToday =
    statisticsResponse.statisticHistory[getDateString(new Date())];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full justify-between gap-3 sm:gap-4 items-center select-none">
      {statistics.map((statistic, index) => {
        const value = getValueFromKey(statisticsToday, statistic.key);

        return (
          <UserStatistic
            key={index}
            name={statistic.name}
            icon={statistic.icon}
            format={statistic.format}
            value={value}
            tooltip={
              statistic.tooltip ? statistic.tooltip(statisticsToday) : undefined
            }
          />
        );
      })}
    </div>
  );
}
