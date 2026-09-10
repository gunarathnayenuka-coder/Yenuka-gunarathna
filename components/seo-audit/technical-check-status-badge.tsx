import { cn } from "cn";
import { CircleCheck, TriangleAlert, CircleAlert, MinusCircle } from "lucide-react";
import type { TechnicalCheckStatus } from "@/types";

const STATUS_CONFIG: Record<
  TechnicalCheckStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pass: { label: "Pass", className: "bg-success/10 text-success border-success/20", icon: CircleCheck },
  warning: { label: "Warning", className: "bg-warning/10 text-warning border-warning/20", icon: TriangleAlert },
  fail: { label: "Fail", className: "bg-critical/10 text-critical border-critical/20", icon: CircleAlert },
  not_applicable: { label: "N/A", className: "bg-muted text-muted-foreground border-border", icon: MinusCircle },
};

export function TechnicalCheckStatusBadge({ status, className }: { status: TechnicalCheckStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}
