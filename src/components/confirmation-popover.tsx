"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { ReactNode } from "react";

type ConfirmationPopoverProps = {
  /**
   * The message to display in the popover.
   */
  message: string;

  /**
   * The text for the confirmation button.
   */
  confirmationButton: string;

  /**
   * The function to call when the confirmation button is clicked.
   */
  onConfirm: () => void;

  /**
   * The trigger element for the popover.
   */
  children: ReactNode;
};

export default function ConfirmationPopover({
  message,
  confirmationButton,
  onConfirm,
  children,
}: ConfirmationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="flex gap-1.5 items-center">
          <PopoverClose asChild>
            <Button variant="destructive" size="xs" onClick={onConfirm}>
              {confirmationButton}
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button variant="secondary" size="xs">
              Nevermind
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
