import { cn } from "cn";
import type { BacklinkStatus } from "@/types";

const STATUS_CONFIG: Record<BacklinkStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  new: { label: "New", className: "bg-info/10 text-info border-info/20" },
  lost: { label: "Lost", className: "bg-critical/10 text-critical border-critical/20" },
  suspicious: { label: "Suspicious", className: "bg-warning/10 text-warning border-warning/20" },
};

/** Backlink status pill, styled to match IntentBadge/StatusBadge conventions. */
export function BacklinkStatusBadge({ status, className }: { status: BacklinkStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
