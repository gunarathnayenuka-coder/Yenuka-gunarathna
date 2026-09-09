import { cn } from "cn";
import type { IssueStatus } from "@/types";

const STATUS_CONFIG: Record<IssueStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-critical/10 text-critical border-critical/20" },
  in_progress: { label: "In Progress", className: "bg-info/10 text-info border-info/20" },
  resolved: { label: "Resolved", className: "bg-success/10 text-success border-success/20" },
  ignored: { label: "Ignored", className: "bg-muted text-muted-foreground border-border" },
};

export function StatusBadge({ status, className }: { status: IssueStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

const GENERIC_STATUS_CLASS: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  published: "bg-success/10 text-success border-success/20",
  completed: "bg-success/10 text-success border-success/20",
  success: "bg-success/10 text-success border-success/20",
  approved: "bg-success/10 text-success border-success/20",
  onboarding: "bg-info/10 text-info border-info/20",
  crawling: "bg-info/10 text-info border-info/20",
  review: "bg-info/10 text-info border-info/20",
  draft: "bg-muted text-muted-foreground border-border",
  idle: "bg-muted text-muted-foreground border-border",
  paused: "bg-warning/10 text-warning border-warning/20",
  needs_update: "bg-warning/10 text-warning border-warning/20",
  failed: "bg-critical/10 text-critical border-critical/20",
  error: "bg-critical/10 text-critical border-critical/20",
  churned: "bg-critical/10 text-critical border-critical/20",
};

/** Generic status pill for any free-text status string not covered by StatusBadge. */
export function GenericStatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  const cls = GENERIC_STATUS_CLASS[key] ?? "bg-muted text-muted-foreground border-border";
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", cls, className)}>
      {label}
    </span>
  );
}
