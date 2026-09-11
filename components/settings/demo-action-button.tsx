"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** A button for actions that aren't wired up to a real backend in this demo — clicking it just confirms via toast. */
export function DemoActionButton({
  toastMessage,
  onClick,
  ...props
}: ComponentProps<typeof Button> & { toastMessage: string }) {
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toast.info(toastMessage);
      }}
    />
  );
}
