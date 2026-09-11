import { cn } from "cn";
import type { Backlink } from "@/types";

type LinkType = Backlink["linkType"];

const LINK_TYPE_CONFIG: Record<LinkType, { label: string; className: string }> = {
  dofollow: { label: "Dofollow", className: "bg-success/10 text-success border-success/20" },
  nofollow: { label: "Nofollow", className: "bg-muted text-muted-foreground border-border" },
  ugc: { label: "UGC", className: "bg-info/10 text-info border-info/20" },
  sponsored: { label: "Sponsored", className: "bg-warning/10 text-warning border-warning/20" },
};

/** Link-type pill (dofollow/nofollow/ugc/sponsored), styled to match IntentBadge conventions. */
export function LinkTypeBadge({ type, className }: { type: LinkType; className?: string }) {
  const config = LINK_TYPE_CONFIG[type];
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
