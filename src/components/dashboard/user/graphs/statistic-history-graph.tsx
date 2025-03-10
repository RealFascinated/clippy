"use client";

import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { UserGraphResponse } from "@/type/api/user/graph-response";
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  BarElement
);

type ChartTypes = "line" | "bar";

const options: ChartOptions<ChartTypes> = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      grid: { color: "#252525" },
      reverse: false,
    },
    y: {
      type: "linear",
      grid: { color: "#252525" },
      display: true,
      ticks: { display: false },
    },
    y1: {
      type: "linear",
      display: true,
      position: "left",
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        callback: function (tickValue: number | string) {
          if (typeof tickValue === "number") {
            return formatBytes(tickValue);
          }
          return tickValue;
        },
      },
    },
    y2: {
      type: "linear",
      display: false,
      position: "right",
    },
    y3: {
      type: "linear",
      display: false,
      position: "right",
    },
    y4: {
      type: "linear",
      display: false,
      position: "right",
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label === "Storage Used") {
            return `${label}: ${formatBytes(context.parsed.y)}`;
          }
          return `${label}: ${formatNumberWithCommas(context.parsed.y)}`;
        },
      },
    },
  },
};

const colors = {
  storage: {
    border: "rgb(255, 99, 132)",
    background: "rgba(255, 99, 132, 0.5)",
  },
  views: {
    border: "rgb(75, 192, 192)",
    background: "rgba(75, 192, 192, 0.5)",
  },
  uploads: {
    border: "rgb(13, 110, 253)",
    background: "rgba(13, 110, 253, 0.5)",
  },
  dailyUploads: {
    border: "rgba(147, 51, 234, 0.8)",
    background: "rgba(147, 51, 234, 0.8)",
  },
  dailyViews: {
    border: "rgba(75, 192, 192, 0.8)",
    background: "rgba(75, 192, 192, 0.8)",
  },
};

type StatisticHistoryGraphProps = {
  userGraphData: UserGraphResponse;
};

export default function StatisticHistoryGraph({
  userGraphData,
}: StatisticHistoryGraphProps) {
  let labels = [];

  for (let previous = 0; previous < 60; previous++) {
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - previous);
    labels.push(format(previousDate, "yyyy-MM-dd"));
  }
  labels = labels.reverse();

  const chartData: ChartData<ChartTypes> = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "Storage Used",
        data: labels.map(
          label =>
            userGraphData.statisticHistory[label]?.storageMetrics
              ?.usedStorage ?? null
        ),
        borderColor: colors.storage.border,
        backgroundColor: colors.storage.background,
        yAxisID: "y1",
      },
      {
        type: "line" as const,
        label: "Total Views",
        data: labels.map(
          label =>
            userGraphData.statisticHistory[label]?.fileMetrics?.views ?? null
        ),
        borderColor: colors.views.border,
        backgroundColor: colors.views.background,
        yAxisID: "y2",
      },
      {
        type: "line" as const,
        label: "Total Uploads",
        data: labels.map(
          label =>
            userGraphData.statisticHistory[label]?.userMetrics?.uploads ?? null
        ),
        borderColor: colors.uploads.border,
        backgroundColor: colors.uploads.background,
        yAxisID: "y3",
      },
      {
        type: "bar" as const,
        label: "Daily Uploads",
        data: labels.map(
          label =>
            userGraphData.statisticHistory[label]?.userMetrics?.dailyUploads ??
            null
        ),
        backgroundColor: colors.dailyUploads.background,
        borderColor: colors.dailyUploads.border,
        yAxisID: "y4",
      },
      {
        type: "bar" as const,
        label: "Daily Views",
        data: labels.map(
          label =>
            userGraphData.statisticHistory[label]?.fileMetrics?.dailyViews ??
            null
        ),
        backgroundColor: colors.dailyViews.background,
        borderColor: colors.dailyViews.border,
        yAxisID: "y4",
      },
    ],
  };

  return (
    <div className="h-[400px] w-full p-2 bg-background/70 rounded-md border border-muted">
      <Chart
        type="line"
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
  );
}
