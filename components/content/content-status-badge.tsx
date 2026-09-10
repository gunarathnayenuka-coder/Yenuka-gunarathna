import { cn } from "cn";
import type { ContentStatus } from "@/types";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { CONTENT_STATUS_LABELS } from "./labels";

/**
 * GenericStatusBadge already color-codes "draft" / "review" / "approved" / "published" /
 * "needs_update" correctly, so those are rendered as-is. "idea" and "brief" aren't in its
 * map (it falls back to a neutral style for them), so we give those two a distinct tint here.
 */
const EXTRA_CLASS: Partial<Record<ContentStatus, string>> = {
  idea: "bg-secondary text-secondary-foreground border-transparent",
  brief: "bg-info/10 text-info border-info/20",
};

export function ContentStatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  const extra = EXTRA_CLASS[status];
  if (!extra) return <GenericStatusBadge status={status} className={className} />;
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", extra, className)}>
      {CONTENT_STATUS_LABELS[status]}
    </span>
  );
}
