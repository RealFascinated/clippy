"use client";

import GenericChart, {
  ChartDatasetConfig,
} from "@/components/charts/generic-chart";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

const colors = {
  storage: {
    line: "rgb(59, 130, 246)", // Blue-500
    fill: "rgba(59, 130, 246, 0.08)",
  },
  views: {
    line: "rgb(16, 185, 129)", // Emerald-500
    fill: "rgba(16, 185, 129, 0.08)",
  },
  uploads: {
    line: "rgb(139, 92, 246)", // Violet-500
    fill: "rgba(139, 92, 246, 0.08)",
  },
  dailyUploads: {
    bar: "rgba(14, 165, 233, 0.7)", // Sky-500
  },
  dailyViews: {
    bar: "rgba(168, 85, 247, 0.7)", // Purple-500
  },
};

type StatisticHistoryGraphProps = {
  userGraphData: UserStatisticsResponse;
};

export default function StatisticHistoryGraph({
  userGraphData,
}: StatisticHistoryGraphProps) {
  const { labels, labelToLookup } = useMemo(() => {
    const labels: string[] = [];
    const labelToLookup = new Map<string, string>();

    for (let previous = 0; previous < 60; previous++) {
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - previous);
      const currentYear = new Date().getFullYear();
      const formatString =
        previousDate.getFullYear() === currentYear ? "MMM dd" : "yyyy-MM-dd";
      const displayLabel = format(previousDate, formatString);
      const lookupLabel = format(previousDate, "yyyy-MM-dd");
      labels.push(displayLabel);
      labelToLookup.set(displayLabel, lookupLabel);
    }

    return {
      labels: labels.reverse(),
      labelToLookup,
    };
  }, []);

  const datasetConfigs: ChartDatasetConfig<UserStatisticsResponse>[] = useMemo(
    () => [
      {
        title: "Storage Used",
        field: "storageMetrics.usedStorage",
        color: colors.storage.line,
        axisId: "y1",
        legendId: "storage-used",
        backgroundColor: colors.storage.fill,
        type: "line",
        fill: true,
        defaultLegendState: true,
        axisConfig: {
          reverse: false,
          display: true,
          position: "left",
          min: 0,
          valueFormatter: formatBytes,
        },
        labelFormatter: (title, value) => `${title}: ${formatBytes(value)}`,
      },
      {
        title: "Total Views",
        field: "fileMetrics.views",
        color: colors.views.line,
        axisId: "y2",
        legendId: "total-views",
        backgroundColor: colors.views.fill,
        type: "line",
        fill: true,
        defaultLegendState: true,
        axisConfig: {
          reverse: false,
          display: false,
          position: "left",
          min: 0,
        },
        labelFormatter: (title, value) =>
          `${title}: ${formatNumberWithCommas(value)}`,
      },
      {
        title: "Total Uploads",
        field: "userMetrics.uploads",
        color: colors.uploads.line,
        axisId: "y3",
        legendId: "total-uploads",
        backgroundColor: colors.uploads.fill,
        type: "line",
        fill: true,
        defaultLegendState: true,
        axisConfig: {
          reverse: false,
          display: false,
          position: "left",
          min: 0,
        },
        labelFormatter: (title, value) =>
          `${title}: ${formatNumberWithCommas(value)}`,
      },
      {
        title: "Daily Uploads",
        field: "userMetrics.dailyUploads",
        color: colors.dailyUploads.bar,
        axisId: "y4",
        type: "bar",
        legendId: "daily-uploads",
        defaultLegendState: true,
        axisConfig: {
          reverse: false,
          display: false,
          position: "right",
          min: 0,
        },
        labelFormatter: (title, value) =>
          `${title}: ${formatNumberWithCommas(value)}`,
      },
      {
        title: "Daily Views",
        field: "fileMetrics.dailyViews",
        color: colors.dailyViews.bar,
        axisId: "y4",
        type: "bar",
        legendId: "daily-views",
        defaultLegendState: true,
        axisConfig: {
          reverse: false,
          display: false,
          position: "right",
          min: 0,
        },
        labelFormatter: (title, value) =>
          `${title}: ${formatNumberWithCommas(value)}`,
      },
    ],
    []
  );

  const getDataValue = (
    data: UserStatisticsResponse,
    field: string,
    displayLabel: string
  ) => {
    const lookupLabel = labelToLookup.get(displayLabel);
    if (!lookupLabel) return null;

    const fieldParts = field.split(".");
    let value: any = data.statisticHistory[lookupLabel];
    for (const part of fieldParts) {
      value = value?.[part];
    }
    return value ?? null;
  };

  return (
    <GenericChart
      data={userGraphData}
      labels={labels}
      datasetConfigs={datasetConfigs}
      title="Activity Overview"
      subtitle={`Your account statistics over the past ${labels.length} days`}
      icon={<TrendingUp className="size-4 text-primary" />}
      chartId="statistic-history-chart"
      getDataValue={getDataValue}
      height={450}
    />
  );
}
