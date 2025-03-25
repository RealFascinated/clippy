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
    <div className="p-6 flex-col gap-2 h-30 bg-muted bg-gradient-to-br from-background/90 to-background/70 hover:from-background/95 hover:to-background/75 transition-all duration-300 flex justify-between rounded-xl border border-muted/50 shadow-md hover:shadow-lg group">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">
          {name}
        </span>
        <div className="text-muted-foreground group-hover:text-primary/80 transition-colors">
          {icon}
        </div>
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
