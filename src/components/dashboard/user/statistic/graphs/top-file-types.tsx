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
    <GenericChart
      data={mimeTypeDistribution}
      labels={labels}
      datasetConfigs={datasetConfigs}
      title="Top File Types"
      subtitle="Most common file types in your uploads"
      icon={<BarChart2 className="size-4 text-primary" />}
      chartId="top-file-types"
      getDataValue={(data, _, label) => data[label] ?? null}
    />
  );
}
