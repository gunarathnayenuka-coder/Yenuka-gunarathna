import type { Backlink } from "@/types";
import { EmptyState } from "@/components/shared";

/** Groups backlinks by exact anchor text and shows the top occurrences as a proportional bar list. */
export function AnchorTextDistribution({ backlinks }: { backlinks: Backlink[] }) {
  const counts = new Map<string, number>();
  for (const backlink of backlinks) {
    counts.set(backlink.anchorText, (counts.get(backlink.anchorText) ?? 0) + 1);
  }
  const rows = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const max = rows[0]?.[1] ?? 1;

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No anchor text data"
        description="Anchor text distribution will appear once backlinks are tracked."
        className="border-none py-8"
      />
    );
  }

  return (
    <div className="space-y-3">
      {rows.map(([anchor, count]) => (
        <div key={anchor} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="max-w-72 truncate font-medium text-foreground" title={anchor}>
              {anchor}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {count} link{count !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(4, (count / max) * 100)}%`, backgroundColor: "var(--chart-1)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
