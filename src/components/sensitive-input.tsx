"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  InputHTMLAttributes,
  isValidElement,
  ReactNode,
  useState,
} from "react";

type SensitiveInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value: string | ReactNode;
};

const SensitiveInput = forwardRef<HTMLInputElement, SensitiveInputProps>(
  ({ className, value, ...props }, ref) => {
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const isReactNode: boolean = isValidElement(value);
    return (
      <div className="group w-full relative flex items-center">
        {isReactNode ? (
          // Rendering for ReactNode
          <div
            className={cn(
              "w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background",
              "pr-10 md:pr-4 transition-all duration-200 transform-gpu",
              !isRevealed && "blur-[4px] hover:blur-none focus:blur-none",
              className
            )}
          >
            {value}
          </div>
        ) : (
          // If it's a string, use it as the input value
          <Input
            ref={ref}
            className={cn(
              "pr-10 md:pr-4 transition-all duration-200 transform-gpu",
              !isRevealed && "blur-[4px] hover:blur-none focus:blur-none",
              className
            )}
            type="text"
            value={value as string}
            {...props}
          />
        )}
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
