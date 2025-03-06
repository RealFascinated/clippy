"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { forwardRef, InputHTMLAttributes } from "react";

type SensitiveInputProps = InputHTMLAttributes<HTMLInputElement>;

const SensitiveInput = forwardRef<HTMLInputElement, SensitiveInputProps>(
  ({ className, ...props }, ref) => {
    const [isRevealed, setIsRevealed] = React.useState(false);
    return (
      <div className="group w-full relative flex items-center">
        <Input
          ref={ref}
          className={cn(
            "pr-10 md:pr-4 transition-all duration-200 transform-gpu",
            !isRevealed && "blur-[4px] hover:blur-none focus:blur-none",
            className
          )}
          type="text"
          {...props}
        />
        <Button
          className="md:hidden absolute right-0 h-full px-3 py-2 hover:bg-transparent"
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsRevealed(!isRevealed)}
        >
          {isRevealed ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  }
);
SensitiveInput.displayName = "SensitiveInput";
export { SensitiveInput };
