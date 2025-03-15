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
    background: "rgba(99, 102, 241, 0.5)", // Indigo
  },
  {
    background: "rgba(14, 165, 233, 0.5)", // Sky blue
  },
  {
    background: "rgba(34, 197, 94, 0.5)", // Green
  },
  {
    background: "rgba(249, 115, 22, 0.5)", // Orange
  },
  {
    background: "rgba(236, 72, 153, 0.5)", // Pink
  },
  {
    background: "rgba(168, 85, 247, 0.5)", // Purple
  },
  {
    background: "rgba(234, 179, 8, 0.5)", // Yellow
  },
  {
    background: "rgba(244, 63, 94, 0.5)", // Rose
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
          type: "doughnut",
          cutoutPercentage: "75%",
          borderWidth: 0,
          hoverOffset: 4,
          axisConfig: {
            reverse: false,
            display: false,
            position: "left",
          },
          labelFormatter: (_, value) => `${value} files`,
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

      <div className="flex-1">
        {labels.length > 0 ? (
          <GenericChart
            data={mimeTypeDistribution}
            labels={labels}
            datasetConfigs={datasetConfigs}
            chartId="top-file-types"
            getDataValue={(data, _, label) => data[label] ?? null}
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
      </div>
    </div>
  );
}
