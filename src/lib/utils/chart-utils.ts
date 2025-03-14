/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartDataset } from "chart.js";

export type AxisPosition = "left" | "right";
export type DatasetDisplayType = "line" | "bar" | "doughnut";

export type Axis = {
  id?: string;
  position?: AxisPosition;
  display?: boolean;
  grid?: { color?: string; drawOnChartArea?: boolean };
  title?: { display: boolean; text?: string; color?: string };
  ticks?: {
    stepSize?: number;
    callback?: (value: number, index: number, values: any) => string;
    font?: { size?: number; weight?: string; color?: string };
    color?: string;
  };
  reverse?: boolean;
};

export type Dataset = ChartDataset<
  "line" | "bar" | "doughnut",
  (number | null)[]
> & {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor?: string;
  fill: boolean;
  lineTension: number;
  spanGaps: boolean;
  yAxisID: string;
  hidden?: boolean;
  stack?: string;
  order?: number;
  maxBarThickness?: number;
  type?: DatasetDisplayType;
  pointRadius?: number;
  pointHoverRadius?: number;
  showLine?: boolean;
  legendId?: string;
};

export type DatasetConfig = {
  title: string;
  field: string;
  color: string;
  axisId: string;
  legendId: string;
  axisConfig: {
    reverse: boolean;
    display: boolean;
    hideOnMobile?: boolean;
    displayName?: string;
    position: AxisPosition;
    valueFormatter?: (value: number) => string;
    stack?: string;
    stackOrder?: number;
  };
  defaultLegendState?: boolean;
  type?: DatasetDisplayType;
  labelFormatter: (value: number) => string;
  pointRadius?: number;
};

export const generateChartAxis = (
  id: string,
  reverse: boolean,
  display: boolean,
  position: AxisPosition,
  displayName?: string,
  valueFormatter?: (value: number) => string
): Axis => ({
  id,
  position,
  display,
  grid: {
    drawOnChartArea: id === "y",
    color: id === "y" ? "rgba(255, 255, 255, 0.05)" : "",
  },
  title: { display: true, text: displayName, color: "rgb(156, 163, 175)" },
  ticks: {
    font: { size: 11 },
    color: "rgb(156, 163, 175)",
    callback: (value: number) => {
      return valueFormatter !== undefined
        ? valueFormatter(value)
        : value.toString();
    },
  },
  reverse,
});

export const generateChartDataset = (
  label: string,
  data: (number | null)[],
  borderColor: string,
  yAxisID: string,
  showLegend: boolean = true,
  stack?: string,
  stackOrder?: number,
  type?: DatasetDisplayType,
  pointRadius: number = 0,
  backgroundColor?: string,
  legendId?: string
): Dataset => ({
  label,
  data,
  borderColor,
  backgroundColor:
    backgroundColor || (type === "bar" ? borderColor : undefined),
  fill: type === "line",
  lineTension: 0.4,
  spanGaps: false,
  yAxisID,
  hidden: !showLegend,
  type,
  stack,
  order: stackOrder,
  maxBarThickness: 12,
  pointRadius,
  pointHoverRadius: 4,
  showLine: type !== "bar",
  legendId,
});
