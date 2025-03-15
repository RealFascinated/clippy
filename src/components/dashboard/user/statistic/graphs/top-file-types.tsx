"use client";

import GenericChart, {
  ChartDatasetConfig,
} from "@/components/charts/generic-chart";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import { BarChart2 } from "lucide-react";
import { useMemo } from "react";

type TopMimeTypesProps = {
  userGraphData: UserStatisticsResponse;
};

const colors = [
  {
    background: "rgba(79, 70, 229, 0.75)", // Deep indigo
  },
  {
    background: "rgba(6, 182, 212, 0.75)", // Cyan
  },
  {
    background: "rgba(16, 185, 129, 0.75)", // Emerald
  },
  {
    background: "rgba(245, 158, 11, 0.75)", // Amber
  },
  {
    background: "rgba(219, 39, 119, 0.75)", // Deep pink
  },
  {
    background: "rgba(139, 92, 246, 0.75)", // Violet
  },
  {
    background: "rgba(59, 130, 246, 0.75)", // Blue
  },
  {
    background: "rgba(239, 68, 68, 0.75)", // Red
  },
];

export default function TopFileTypes({ userGraphData }: TopMimeTypesProps) {
  const { labels, mimeTypeDistribution } = useMemo(() => {
    const distribution = Object.entries(userGraphData.mimetypeDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      labels: distribution.map(([key]) => key),
      mimeTypeDistribution: distribution.reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }, [userGraphData]);

  const datasetConfigs: ChartDatasetConfig<typeof mimeTypeDistribution>[] =
    useMemo(
      () => [
        {
          title: "Amount",
          field: "value",
          color: "transparent",
          backgroundColor: labels.map((_, i) => colors[i].background),
          axisId: "y",
          legendId: "amount",
          type: "pie",
          borderWidth: 0,
          hoverOffset: 4,
          axisConfig: {
            reverse: false,
            display: false,
            position: "left",
          },
          labelFormatter: (_, value) => `${value} file${value > 1 ? "s" : ""}`,
        },
      ],
      [labels]
    );

  return (
    <div className="w-full h-[400px] flex flex-col">
      <div className="px-6 py-4 border-b border-muted/10">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Top File Types</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Most common file types in your uploads
        </p>
      </div>

      <>
        {labels.length > 0 ? (
          <GenericChart
            data={mimeTypeDistribution}
            labels={labels}
            datasetConfigs={datasetConfigs}
            chartId="top-file-types"
            getDataValue={(data, _, label) => data[label]}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <BarChart2 className="size-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No file type data</p>
            <p className="text-xs">
              Upload some files to see file type statistics
            </p>
          </div>
        )}
      </>
    </div>
  );
}
