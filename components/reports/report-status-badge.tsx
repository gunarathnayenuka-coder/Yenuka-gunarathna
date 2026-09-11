import { cn } from "cn";
import type { Report } from "@/types";
import { REPORT_STATUS_LABELS } from "./labels";

const STATUS_CLASS: Record<Report["status"], string> = {
  draft: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-info/10 text-info border-info/20",
  generated: "bg-warning/10 text-warning border-warning/20",
  sent: "bg-success/10 text-success border-success/20",
};

export function ReportStatusBadge({ status, className }: { status: Report["status"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        STATUS_CLASS[status],
        className,
      )}
    >
      {REPORT_STATUS_LABELS[status]}
    </span>
  );
}
