import { cn } from "cn";
import type { CoreWebVitalRating } from "@/types";

const RATING_CONFIG: Record<CoreWebVitalRating, { label: string; className: string }> = {
  good: { label: "Good", className: "bg-success/10 text-success border-success/20" },
  needs_improvement: { label: "Needs Improvement", className: "bg-warning/10 text-warning border-warning/20" },
  poor: { label: "Poor", className: "bg-critical/10 text-critical border-critical/20" },
};

export function CwvRatingBadge({ rating, className }: { rating: CoreWebVitalRating; className?: string }) {
  const config = RATING_CONFIG[rating];
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
