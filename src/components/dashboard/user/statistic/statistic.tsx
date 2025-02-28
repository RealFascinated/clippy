import SimpleTooltip from "@/components/simple-tooltip";
import { ReactElement } from "react";

type StatisticProps = {
  name: string;
  value: unknown;
  icon: ReactElement;
  tooltip?: string | ReactElement;
};

export default function UserStatistic({
  name,
  value,
  icon,
  tooltip,
}: StatisticProps) {
  const base = (
    <div className="p-2 bg-secondary/90 flex justify-between rounded-md border">
      <div className="flex flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-muted-foreground">{`${value}`}</span>
      </div>
      {icon}
    </div>
  );

  if (tooltip) {
    return <SimpleTooltip content={tooltip}>{base}</SimpleTooltip>;
  }

  return base;
}
