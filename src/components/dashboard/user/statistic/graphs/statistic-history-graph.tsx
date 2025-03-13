"use client";

import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { UserStatisticsResponse } from "@/type/api/user/graph-response";
import {
  BarController,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LineController,
  BarController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  BarElement
);

type ChartTypes = "line" | "bar";

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
  const { labels, lookupLabels } = useMemo(() => {
    const labels = [];
    const lookupLabels = [];

    for (let previous = 0; previous < 60; previous++) {
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - previous);
      const currentYear = new Date().getFullYear();
      const formatString =
        previousDate.getFullYear() === currentYear ? "MMM dd" : "yyyy-MM-dd";
      labels.push(format(previousDate, formatString));
      lookupLabels.push(format(previousDate, "yyyy-MM-dd"));
    }
    return {
      labels: labels.reverse(),
      lookupLabels: lookupLabels.reverse(),
    };
  }, []);

  const options = useMemo<ChartOptions<ChartTypes>>(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
            tickLength: 0,
          },
          ticks: {
            font: {
              size: 11,
            },
            maxRotation: 0,
            color: "rgb(156, 163, 175)", // text-gray-400
          },
          border: {
            display: false,
          },
        },
        y: {
          type: "linear",
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
          border: {
            display: false,
          },
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
            font: {
              size: 11,
            },
            padding: 8,
            color: "rgb(156, 163, 175)", // text-gray-400
            callback: function (tickValue: number | string) {
              if (typeof tickValue === "number") {
                return formatBytes(tickValue);
              }
              return tickValue;
            },
          },
          border: {
            display: false,
          },
        },
        y2: {
          type: "linear",
          display: false,
          position: "right",
          border: {
            display: false,
          },
        },
        y3: {
          type: "linear",
          display: false,
          position: "right",
          border: {
            display: false,
          },
        },
        y4: {
          type: "linear",
          display: false,
          position: "right",
          border: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "center",
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            font: {
              size: 13,
              family: "system-ui",
              weight: "normal",
            },
            color: "rgb(156, 163, 175)", // text-gray-400
          },
        },
        tooltip: {
          padding: 10,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 12,
          },
          bodyFont: {
            size: 11,
          },
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              if (value === null || value === undefined) {
                return "";
              }

              const label = context.dataset.label || "";
              if (label === "Storage Used") {
                return `${label}: ${formatBytes(value)}`;
              }
              return `${label}: ${formatNumberWithCommas(value)}`;
            },
          },
        },
      },
    }),
    []
  );

  const chartData = useMemo<ChartData<ChartTypes>>(
    () => ({
      labels,
      datasets: [
        {
          type: "line",
          label: "Storage Used",
          data: lookupLabels.map(
            label =>
              userGraphData.statisticHistory[label]?.storageMetrics
                ?.usedStorage ?? null
          ),
          borderColor: colors.storage.line,
          backgroundColor: colors.storage.fill,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          yAxisID: "y1",
        },
        {
          type: "line",
          label: "Total Views",
          data: lookupLabels.map(
            label =>
              userGraphData.statisticHistory[label]?.fileMetrics?.views ?? null
          ),
          borderColor: colors.views.line,
          backgroundColor: colors.views.fill,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          yAxisID: "y2",
        },
        {
          type: "line",
          label: "Total Uploads",
          data: lookupLabels.map(
            label =>
              userGraphData.statisticHistory[label]?.userMetrics?.uploads ??
              null
          ),
          borderColor: colors.uploads.line,
          backgroundColor: colors.uploads.fill,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          yAxisID: "y3",
        },
        {
          type: "bar",
          label: "Daily Uploads",
          data: lookupLabels.map(
            label =>
              userGraphData.statisticHistory[label]?.userMetrics
                ?.dailyUploads ?? null
          ),
          backgroundColor: colors.dailyUploads.bar,
          borderRadius: 3,
          yAxisID: "y4",
        },
        {
          type: "bar",
          label: "Daily Views",
          data: lookupLabels.map(
            label =>
              userGraphData.statisticHistory[label]?.fileMetrics?.dailyViews ??
              null
          ),
          backgroundColor: colors.dailyViews.bar,
          borderRadius: 3,
          yAxisID: "y4",
        },
      ],
    }),
    [labels, lookupLabels, userGraphData]
  );

  return (
    <div className="w-full flex flex-col">
      <div className="px-6 py-4 border-b border-muted/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Activity Overview</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your account statistics over the past {labels.length} days
        </p>
      </div>

      <div className="w-full">
        <div className="h-[400px] w-full p-4">
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
                        this.height += 12;
                      }
                    };
                  }
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
