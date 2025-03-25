"use client";

import SimpleTooltip from "@/components/simple-tooltip";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { ReactElement } from "react";
import CountUp from "react-countup";

type StatisticProps = {
  name: string;
  value: number;
  format: "number" | "bytes";
  icon: ReactElement;
  tooltip?: string | ReactElement;
};

export default function UserStatistic({
  name,
  value,
  format,
  icon,
  tooltip,
}: StatisticProps) {
  const base = (
    <div className="flex flex-col gap-4 h-full bg-card rounded-xl p-6 border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          {name}
        </span>
        <div className="text-primary">{icon}</div>
      </div>
      <span className="text-2xl font-bold tracking-tight">
        <CountUp
          end={value}
          duration={1.3}
          start={0}
          formattingFn={
            format == "bytes" ? formatBytes : formatNumberWithCommas
          }
        />
      </span>
    </div>
  );

  if (tooltip) {
    return <SimpleTooltip content={tooltip}>{base}</SimpleTooltip>;
  }

  return base;
}
