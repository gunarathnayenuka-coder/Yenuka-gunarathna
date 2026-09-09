import { cn } from "cn";
import { AlertCircle, AlertTriangle, Info, CircleCheck } from "lucide-react";
import type { Severity } from "@/types";

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  critical: {
    label: "Critical",
    className: "bg-critical/10 text-critical border-critical/20",
    icon: AlertCircle,
  },
  high: {
    label: "High",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    className: "bg-info/10 text-info border-info/20",
    icon: Info,
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground border-border",
    icon: CircleCheck,
  },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = SEVERITY_CONFIG[severity];
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
