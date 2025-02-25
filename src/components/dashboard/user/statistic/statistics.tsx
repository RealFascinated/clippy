import request from "@/lib/request";
import { formatBytes } from "@/lib/utils/utils";
import { UserStatisticsResponse } from "@/type/api/user/statistics-response";
import { ClockIcon, EyeIcon, FileIcon, ServerIcon } from "lucide-react";
import { ReactElement } from "react";
import UserStatistic from "./statistic";
import { headers } from "next/headers";
import { AxiosHeaders } from "axios";
import { env } from "@/lib/env";

type Format = "number" | "bytes";
type Statistic = {
  key: keyof UserStatisticsResponse;
  name: string;
  format: Format;
  icon: ReactElement;
};

const statistics: Statistic[] = [
  {
    key: "totalUploads",
    name: "Total Uploads",
    format: "number",
    icon: <FileIcon className="size-5" />,
  },
  {
    key: "uploadsToday",
    name: "Uploads Today",
    format: "number",
    icon: <ClockIcon className="size-5" />,
  },
  {
    key: "storageUsed",
    name: "Storage Used",
    format: "bytes",
    icon: <ServerIcon className="size-5" />,
  },
  {
    key: "totalViews",
    name: "Total Views",
    format: "number",
    icon: <EyeIcon className="size-5" />,
  },
];

/**
 * Formats the value for a statistic
 *
 * @param value the value to format
 * @param format the format to use
 * @returns the formatted value
 */
function format(value: unknown, format: Format) {
  switch (format) {
    case "number": {
      return value;
    }
    case "bytes": {
      return formatBytes(value as number);
    }
    default: {
      return value;
    }
  }
}

export default async function UserStatistics() {
  const statisticsResponse = await request.get<UserStatisticsResponse>(
    `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/statistics`,
    {
      headers: (await headers()) as unknown as AxiosHeaders,
    }
  );

  if (!statisticsResponse) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full justify-between gap-4 items-center">
      {statistics.map((statistic, index) => {
        const value = statisticsResponse?.[statistic.key];
        return (
          <UserStatistic
            key={index}
            name={statistic.name}
            icon={statistic.icon}
            value={format(value, statistic.format)}
          />
        );
      })}
    </div>
  );
}
