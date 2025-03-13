"use client";

import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  DoughnutController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(ArcElement, DoughnutController);

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
  [key: string]: {
    border: string;
    background: string;
  };
};

const mimeTypeColors: ColorMap = {
  image: {
    border: "rgb(59, 130, 246)",
    background: "rgba(59, 130, 246, 0.5)",
  },
  video: {
    border: "rgb(239, 68, 68)",
    background: "rgba(239, 68, 68, 0.5)",
  },
  audio: {
    border: "rgb(16, 185, 129)",
    background: "rgba(16, 185, 129, 0.5)",
  },
  text: {
    border: "rgb(245, 158, 11)",
    background: "rgba(245, 158, 11, 0.5)",
  },
  application: {
    border: "rgb(139, 92, 246)",
    background: "rgba(139, 92, 246, 0.5)",
  },
};

function generateColor(type: string, border = false): string {
  // Find matching type prefix
  const matchingType = Object.keys(mimeTypeColors).find((key) =>
    type.startsWith(key)
  );
  if (matchingType) {
    return border
      ? mimeTypeColors[matchingType].border
      : mimeTypeColors[matchingType].background;
  }
  return border ? "rgb(107, 114, 128)" : "rgba(107, 114, 128, 0.5)";
}

export default function TopMimeTypes({ userGraphData }: TopMimeTypesProps) {
  const mimeTypeDistribution = Object.entries(
    userGraphData.mimetypeDistribution
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const mimeTypes = mimeTypeDistribution.map(([key]) => key);
  const backgroundColor = mimeTypes.map((type) => generateColor(type));
  const borderColor = mimeTypes.map((type) => generateColor(type, true));

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
        <h2 className="text-lg font-semibold">Top File Types</h2>
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
              beforeInit: (chart) => {
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
