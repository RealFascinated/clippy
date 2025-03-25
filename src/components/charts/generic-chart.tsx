"use client";

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  ChartDataset,
  Chart as ChartJS,
  ChartOptions,
  ChartType,
  ChartTypeRegistry,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
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
  BarElement,
  Filler,
  DoughnutController,
  PieController,
  ArcElement
);

type ChartTypeOptions = "line" | "bar" | "doughnut" | "pie";
type AxisPosition = "left" | "right";

interface AxisConfig {
  reverse: boolean;
  display: boolean;
  hideOnMobile?: boolean;
  displayName?: string;
  position: AxisPosition;
  valueFormatter?: (value: number) => string;
  stack?: string;
  stackOrder?: number;
  min?: number;
}

export interface ChartDatasetConfig<TData> {
  title: string;
  field: string;
  color: string;
  axisId: string;
  legendId: string;
  type?: ChartTypeOptions;
  fill?: boolean;
  axisConfig: AxisConfig;
  defaultLegendState?: boolean;
  labelFormatter: (title: string, value: number) => string;
  pointRadius?: number;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  cutoutPercentage?: string;
  borderWidth?: number;
  hoverOffset?: number;
}

export interface GenericChartProps<TData extends Record<string, unknown>> {
  data: TData;
  labels: string[];
  datasetConfigs: ChartDatasetConfig<TData>[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  chartId: string;
  height?: number;
  getDataValue: (data: TData, field: string, label: string) => number | null;
}

type ChartDatasetWithLegend<TType extends ChartType = ChartType> = ChartDataset<
  TType,
  (number | null | undefined)[]
> & {
  legendId: string;
};

export default function GenericChart<TData extends Record<string, unknown>>({
  data,
  labels,
  datasetConfigs,
  title,
  subtitle,
  icon,
  chartId,
  height = 400,
  getDataValue,
}: GenericChartProps<TData>) {
  const [hiddenStates, setHiddenStates] = useState<Record<string, boolean>>({});

  const axes = useMemo(() => {
    const generatedAxes: Record<string, any> = {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          tickLength: 0,
        },
        ticks: {
          font: { size: 11 },
          maxRotation: 0,
          color: "rgb(156, 163, 175)",
        },
        border: { display: false },
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
    };

    datasetConfigs.forEach(config => {
      const hasData = labels.some(
        label => getDataValue(data, config.field, label) !== null
      );
      if (hasData) {
        generatedAxes[config.axisId] = {
          type: "linear",
          position: config.axisConfig.position,
          display: config.axisConfig.display,
          min: config.axisConfig.min,
          grid: {
            drawOnChartArea: config.axisId === "y",
            color: config.axisId === "y" ? "rgba(255, 255, 255, 0.05)" : "",
          },
          border: {
            display: false,
          },
          ticks: {
            font: { size: 11 },
            color: "rgb(156, 163, 175)",
            padding: 8,
            maxTicksLimit: 12,
            callback: (value: number) => {
              if (typeof value !== "number" || isNaN(value)) return "";
              return config.axisConfig.valueFormatter
                ? config.axisConfig.valueFormatter(Math.max(0, value))
                : value.toString();
            },
          },
        };
      }
    });

    return generatedAxes;
  }, [data, labels, datasetConfigs, getDataValue]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const newHiddenStates: Record<string, boolean> = {};
    datasetConfigs.forEach(config => {
      try {
        const savedState = localStorage.getItem(
          `chart-legend:${chartId}:${config.legendId}`
        );
        newHiddenStates[config.legendId] = savedState === "true";
      } catch (e) {
        newHiddenStates[config.legendId] = !config.defaultLegendState;
      }
    });
    setHiddenStates(newHiddenStates);
  }, [chartId, datasetConfigs]);

  const datasets = useMemo(() => {
    return datasetConfigs
      .map(config => {
        const hasData = labels.some(
          label => getDataValue(data, config.field, label) !== null
        );
        if (hasData) {
          const isBar = config.type === "bar";
          const dataPoints = labels.map(label => {
            const value = getDataValue(data, config.field, label);
            return value;
          });

          const dataset: ChartDatasetWithLegend<ChartTypeOptions> = {
            label: config.title,
            data: dataPoints,
            borderColor: config.color,
            backgroundColor:
              config.backgroundColor || (isBar ? config.color : undefined),
            fill: config.fill ?? !isBar,
            tension: 0.4,
            borderWidth: isBar ? undefined : 2,
            borderRadius: isBar ? 3 : undefined,
            spanGaps: !isBar,
            yAxisID: config.axisId,
            hidden: hiddenStates[config.legendId] ?? !config.defaultLegendState,
            type: config.type,
            stack: config.axisConfig.stack,
            order: config.axisConfig.stackOrder,
            maxBarThickness: 12,
            pointRadius: config.pointRadius || 0,
            pointHoverRadius: 4,
            showLine: !isBar,
            legendId: config.legendId,
            parsing: isBar
              ? {
                  yAxisKey: "y",
                  xAxisKey: "x",
                }
              : undefined,
          };
          return dataset;
        }
        return null;
      })
      .filter(
        (dataset): dataset is NonNullable<typeof dataset> => dataset !== null
      );
  }, [data, labels, datasetConfigs, getDataValue, hiddenStates]);

  const options = useMemo<ChartOptions<keyof ChartTypeRegistry>>(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      layout: {
        padding: 0,
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: datasetConfigs.some(
        config => config.type === "doughnut" || config.type === "pie"
      )
        ? {}
        : axes,
      cutout:
        datasetConfigs.find(config => config.type === "doughnut")
          ?.cutoutPercentage ?? undefined,
      plugins: {
        legend: {
          position: datasetConfigs.some(
            config => config.type === "doughnut" || config.type === "pie"
          )
            ? "bottom"
            : "top",
          align: "center",
          labels: {
            padding: 12,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            font: {
              size: 13,
              family: "system-ui",
              weight: "normal",
            },
            color: "rgb(156, 163, 175)",
          },
          onClick: (event, legendItem, legend) => {
            if (typeof legendItem.datasetIndex === "number") {
              const index = legendItem.datasetIndex;
              const chart = legend.chart;
              const dataset = chart.data.datasets[index] as ChartDataset<
                "line" | "bar" | "doughnut" | "pie",
                (number | null | undefined)[]
              > & { legendId?: string };
              const legendId = dataset.legendId || `dataset-${index}`;
              chart[chart.isDatasetVisible(index) ? "hide" : "show"](index);
              const newHidden = !legendItem.hidden;
              legendItem.hidden = newHidden;
              try {
                localStorage.setItem(
                  `chart-legend:${chartId}:${legendId}`,
                  newHidden.toString()
                );
                setHiddenStates(prev => ({
                  ...prev,
                  [legendId]: newHidden,
                }));
              } catch (e) {
                // Ignore storage errors
              }
            }
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
            beforeBody: function (tooltipItems) {
              const isDoughnutOrPie = datasetConfigs.some(
                config => config.type === "doughnut" || config.type === "pie"
              );
              if (isDoughnutOrPie) return [];

              // If all values are null/undefined/NaN, show "No data"
              const allMissing = tooltipItems.every(item => {
                const value = item.parsed.y;
                return (
                  value === null || value === undefined || Number.isNaN(value)
                );
              });
              return allMissing ? ["No data"] : [];
            },
            label: function (context) {
              const isDoughnutOrPie = datasetConfigs.some(
                config => config.type === "doughnut" || config.type === "pie"
              );
              const value = isDoughnutOrPie ? context.parsed : context.parsed.y;

              if (
                value === null ||
                value === undefined ||
                Number.isNaN(value)
              ) {
                return isDoughnutOrPie ? "No data" : "";
              }

              const config = datasetConfigs.find(
                cfg => cfg.title === context.dataset.label
              );
              return config?.labelFormatter(config.title, value) ?? "";
            },
          },
        },
      },
    }),
    [axes, datasetConfigs, chartId]
  );

  return (
    <div className="w-full flex flex-col" style={{ height: `${height}px` }}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-muted/10">
          {title && (
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <Chart
          type={datasetConfigs[0]?.type ?? "line"}
          data={{ labels, datasets }}
          options={options}
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
  );
}
