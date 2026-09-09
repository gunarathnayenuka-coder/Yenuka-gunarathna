import { cn } from "cn";
import { ArrowUp, ArrowDown, Minus, Sparkles, CircleX } from "lucide-react";
import type { TrendDirection } from "@/types";

const TREND_CONFIG: Record<TrendDirection, { icon: React.ComponentType<{ className?: string }>; className: string; label: string }> = {
  up: { icon: ArrowUp, className: "text-success", label: "Up" },
  down: { icon: ArrowDown, className: "text-critical", label: "Down" },
  flat: { icon: Minus, className: "text-muted-foreground", label: "Flat" },
  new: { icon: Sparkles, className: "text-info", label: "New" },
  lost: { icon: CircleX, className: "text-critical", label: "Lost" },
};

export function TrendIndicator({
  trend,
  value,
  className,
}: {
  trend: TrendDirection;
  value?: string;
  className?: string;
}) {
  const config = TREND_CONFIG[trend];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", config.className, className)}>
      <Icon className="size-3.5" />
      {value ?? config.label}
    </span>
  );
}

/** Signed percentage change indicator (e.g. traffic, revenue deltas). */
export function ChangeIndicator({ pct, className }: { pct: number; className?: string }) {
  const isPositive = pct > 0;
  const isFlat = pct === 0;
  const Icon = isFlat ? Minus : isPositive ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isFlat ? "text-muted-foreground" : isPositive ? "text-success" : "text-critical",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}
