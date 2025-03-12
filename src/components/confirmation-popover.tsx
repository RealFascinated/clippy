"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";

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
   * Should the user need to confirm the action twice?
   */
  doubleConfirmation?: boolean;

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
  doubleConfirmation,
  onConfirm,
  children,
}: ConfirmationPopoverProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  function handleConfirm() {
    if (!doubleConfirmation || confirmed) {
      setOpen(false);
      onConfirm();
      return;
    }
    setConfirmed(true);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen(open);
        if (!open) {
          setConfirmed(false);
        }
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{message}</p>

        <div className="flex gap-1.5 items-center">
          <Button variant="destructive" size="xs" onClick={handleConfirm}>
            {confirmed ? "Are you sure?" : confirmationButton}
          </Button>

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
