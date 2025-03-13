"use client";

import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  DoughnutController,
  Legend,
  Tooltip,
} from "chart.js";
import { BarChart2 } from "lucide-react";
import { Chart } from "react-chartjs-2";

ChartJS.register(ArcElement, DoughnutController, Legend, Tooltip);

type ChartTypes = "doughnut";

const options: ChartOptions<ChartTypes> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
  },
  cutout: "75%",
};

type TopMimeTypesProps = {
  userGraphData: UserStatisticsResponse;
};

type ColorMap = {
  border: string;
  background: string;
};

const colors: ColorMap[] = [
  {
    border: "rgb(99, 102, 241)", // Indigo
    background: "rgba(99, 102, 241, 0.5)",
  },
  {
    border: "rgb(14, 165, 233)", // Sky blue
    background: "rgba(14, 165, 233, 0.5)",
  },
  {
    border: "rgb(34, 197, 94)", // Green
    background: "rgba(34, 197, 94, 0.5)",
  },
  {
    border: "rgb(249, 115, 22)", // Orange
    background: "rgba(249, 115, 22, 0.5)",
  },
  {
    border: "rgb(236, 72, 153)", // Pink
    background: "rgba(236, 72, 153, 0.5)",
  },
  {
    border: "rgb(168, 85, 247)", // Purple
    background: "rgba(168, 85, 247, 0.5)",
  },
  {
    border: "rgb(234, 179, 8)", // Yellow
    background: "rgba(234, 179, 8, 0.5)",
  },
  {
    border: "rgb(244, 63, 94)", // Rose
    background: "rgba(244, 63, 94, 0.5)",
  },
];

export default function TopFileTypes({ userGraphData }: TopMimeTypesProps) {
  const mimeTypeDistribution = Object.entries(
    userGraphData.mimetypeDistribution
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const mimeTypes = mimeTypeDistribution.map(([key]) => key);
  const backgroundColor = mimeTypes.map((_, index) => colors[index].background);
  const borderColor = mimeTypes.map((_, index) => colors[index].border);

  const chartData: ChartData<ChartTypes> = {
    labels: mimeTypes,
    datasets: [
      {
        type: "doughnut" as const,
        label: "Amount",
        data: mimeTypeDistribution.map(([_, value]) => value),
        backgroundColor,
        borderColor,
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

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

      <div className="flex-1 flex items-center justify-center p-4">
        <Chart
          type="doughnut"
          options={options}
          data={chartData}
          plugins={[
            {
              id: "legend-padding",
              beforeInit: chart => {
                if (chart.legend) {
                  const originalFit = chart.legend.fit;
                  chart.legend.fit = function fit() {
                    originalFit.bind(chart.legend)();
                    if (this.height !== undefined) {
                      this.height += 6;
                    }
                  };
                }
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
