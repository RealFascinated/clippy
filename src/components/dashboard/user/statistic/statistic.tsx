import { ReactElement } from "react";

type StatisticProps = {
  name: string;
  value: unknown;
  icon: ReactElement;
  loading: boolean;
};

export default function UserStatistic({
  name,
  value,
  icon,
  loading,
}: StatisticProps) {
  return (
    <div className="p-2 bg-secondary/90 flex justify-between rounded-md border">
      <div className="flex flex-col">
        <span className="font-semibold">{name}</span>

        <span className="text-muted-foreground">
          {loading ? "-" : `${value}`}
        </span>
      </div>
      {icon}
    </div>
  );
}
