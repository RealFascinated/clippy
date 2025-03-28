"use client";

import { cn } from "@/lib/utils/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipTrigger = TooltipPrimitive.Trigger;

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      delayDuration={250}
    >
      <div
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
    </TooltipPrimitive.Root>
  );
};

const TooltipContent = ({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? ReactDOM.createPortal(
        <TooltipPrimitive.Content
          sideOffset={sideOffset}
          className={cn(
            "z-[99999] overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />,
        document.body
      )
    : null;
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
