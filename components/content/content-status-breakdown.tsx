import Link from "next/link";
import type { ContentItem } from "@/types";
import { CONTENT_STATUS_BAR_CLASS, CONTENT_STATUS_LABELS, CONTENT_STATUS_ORDER } from "./labels";

/** Status-breakdown strip for the content dashboard — same visual idea as the dashboard's IssuesSummary, adapted to ContentStatus. */
export function ContentStatusBreakdown({ items, websiteId }: { items: ContentItem[]; websiteId: string }) {
  const counts = CONTENT_STATUS_ORDER.map((status) => ({
    status,
    count: items.filter((i) => i.status === status).length,
  }));
  const total = items.length || 1;

  return (
    <div className="space-y-4">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {counts.map(
          ({ status, count }) =>
            count > 0 && (
              <div key={status} className={CONTENT_STATUS_BAR_CLASS[status]} style={{ width: `${(count / total) * 100}%` }} />
            ),
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {counts.map(({ status, count }) => (
          <Link
            key={status}
            href={`/content/planner?site=${websiteId}`}
            className="rounded-lg border p-3 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${CONTENT_STATUS_BAR_CLASS[status]}`} />
              <span className="text-xs text-muted-foreground">{CONTENT_STATUS_LABELS[status]}</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums">{count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
