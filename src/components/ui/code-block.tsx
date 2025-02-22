import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";

type CodeProps = {
  children: ReactNode;
  className?: string;

  /**
   * Only used in the full code block
   */
  codeClassName?: string;
};

export function CodeBlock({ children, className, codeClassName }: CodeProps) {
  return (
    <pre className={cn("bg-secondary p-1.5 border rounded-md", className)}>
      <code className={cn(codeClassName)}>{children}</code>
    </pre>
  );
}

export function InlineCodeBlock({ children, className }: CodeProps) {
  return (
    <code
      className={cn("bg-secondary px-1 py-0.5 border rounded-md w-fit text-primary", className)}
    >
      {children}
    </code>
  );
}
