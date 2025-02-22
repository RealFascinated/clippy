"use client";

import request from "@/lib/request";
import { formatBytes } from "@/lib/utils/utils";
import { UserStatisticsResponse } from "@/type/api/user/statistics-response";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, EyeIcon, FileIcon, ServerIcon } from "lucide-react";
import { ReactElement } from "react";
import UserStatistic from "./statistic";

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
    icon: <FileIcon />,
  },
  {
    key: "uploadsToday",
    name: "Uploads Today",
    format: "number",
    icon: <ClockIcon />,
  },
  {
    key: "storageUsed",
    name: "Storage Used",
    format: "bytes",
    icon: <ServerIcon />,
  },
  {
    key: "totalViews",
    name: "Total Views",
    format: "number",
    icon: <EyeIcon />,
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

export default function UserStatistics() {
  const { data: statisticsResponse, isLoading } = useQuery<UserStatisticsResponse>({
    queryKey: ["statistics"],
    queryFn: async () => (await request.get<UserStatisticsResponse>("/api/user/statistics"))!,
    placeholderData: data => data,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full justify-between gap-4 items-center">
      {statistics.map((statistic, index) => {
        const value = statisticsResponse?.[statistic.key];
        return (
          <UserStatistic
            key={index}
            name={statistic.name}
            icon={statistic.icon}
            value={!isLoading ? format(value, statistic.format) : undefined}
            loading={isLoading}
          />
        );
      })}
    </div>
  );
}
