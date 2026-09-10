import { cn } from "cn";
import type { SearchIntent } from "@/types";
import { INTENT_BADGE_CLASS, INTENT_LABELS } from "@/lib/labels";

/** Search-intent pill, styled to match SeverityBadge/StatusBadge conventions. */
export function IntentBadge({ intent, className }: { intent: SearchIntent; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        INTENT_BADGE_CLASS[intent],
        className,
      )}
    >
      {INTENT_LABELS[intent]}
    </span>
  );
}
