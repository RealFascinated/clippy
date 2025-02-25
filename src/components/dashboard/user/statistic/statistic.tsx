import { ReactElement } from "react";

type StatisticProps = {
  name: string;
  value: unknown;
  icon: ReactElement;
};

export default function UserStatistic({ name, value, icon }: StatisticProps) {
  return (
    <div className="p-2 bg-secondary/90 flex justify-between rounded-md border">
      <div className="flex flex-col">
        <span className="font-semibold">{name}</span>

        <span className="text-muted-foreground">{`${value}`}</span>
      </div>
      {icon}
    </div>
  );
}
