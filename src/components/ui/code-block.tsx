import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CodeProps = {
  children: ReactNode;
  className?: string;
  codeClassName?: string;
};

export default function CodeBlock({
  children,
  className,
  codeClassName,
}: CodeProps) {
  return (
    <pre className={cn("bg-secondary p-1.5 border rounded-md", className)}>
      <code className={cn(codeClassName)}>{children}</code>
    </pre>
  );
}
