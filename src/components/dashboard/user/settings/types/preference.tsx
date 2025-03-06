import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";

export type PreferenceProps = {
  className?: string;
  header: string;
  badge?: ReactNode;
  description: string;
  inline?: boolean;
  children: ReactNode;
};

export default function Preference({
  className,
  header,
  badge,
  description,
  inline,
  children,
}: PreferenceProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 justify-between",
        inline && "flex-row gap-10 items-center"
      )}
    >
      <div className="flex flex-col select-none">
        <div className="flex gap-3 items-center">
          <h1 className="text-base xs:text-lg font-bold transition-all transform-gpu">
            {header}
          </h1>
          {badge}
        </div>
        <p className="max-w-md text-xs xs:text-sm text-muted-foreground transition-all transform-gpu">
          {description}
        </p>
      </div>
      <div className={cn("flex gap-2.5 items-center", className)}>
        {children}
      </div>
    </div>
  );
}
