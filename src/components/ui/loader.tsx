import { cn } from "@/lib/utils/utils";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  className?: string;
  color?: string;
  size?: number;
};

export default function Loader({
  className,
  color = "var(--primary)",
  size = 32,
}: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2
        className="animate-spin"
        style={{
          width: size,
          height: size,
          color: color,
        }}
      />
    </div>
  );
}
