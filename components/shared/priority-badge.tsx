import { cn } from "cn";
import type { RecommendationPriority } from "@/types";

const PRIORITY_CONFIG: Record<RecommendationPriority, { label: string; dot: string; className: string }> = {
  critical: { label: "Critical", dot: "bg-critical", className: "bg-critical/10 text-critical border-critical/20" },
  high: { label: "High", dot: "bg-warning", className: "bg-warning/10 text-warning border-warning/20" },
  medium: { label: "Medium", dot: "bg-info", className: "bg-info/10 text-info border-info/20" },
  low: { label: "Low", dot: "bg-muted-foreground", className: "bg-muted text-muted-foreground border-border" },
  opportunity: { label: "Opportunity", dot: "bg-success", className: "bg-success/10 text-success border-success/20" },
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: RecommendationPriority;
  className?: string;
}) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

export function PriorityDot({ priority, className }: { priority: RecommendationPriority; className?: string }) {
  return <span className={cn("size-2 shrink-0 rounded-full", PRIORITY_CONFIG[priority].dot, className)} />;
}
