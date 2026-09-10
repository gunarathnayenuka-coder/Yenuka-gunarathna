import type { Keyword } from "@/types";
import { TrendIndicator } from "@/components/shared";
import { formatCompactNumber, formatRank } from "@/lib/format";
import { IntentBadge } from "./intent-badge";

/** Compact single-line keyword row, used wherever keywords are listed without a full table (e.g. keyword map groups). */
export function KeywordList({ keywords }: { keywords: Keyword[] }) {
  return (
    <div className="space-y-1">
      {keywords.map((k) => (
        <div
          key={k.id}
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent/40"
        >
          <span className="min-w-0 truncate font-medium text-foreground">{k.keyword}</span>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <IntentBadge intent={k.intent} />
            <span className="w-20 text-xs text-muted-foreground tabular-nums">{formatCompactNumber(k.volume)}/mo</span>
            <span className="w-8 text-right text-xs font-medium text-foreground tabular-nums">{formatRank(k.currentRank)}</span>
            <TrendIndicator trend={k.trend} className="w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}
