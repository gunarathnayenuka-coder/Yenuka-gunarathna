"use client";

import { useState } from "react";
import type { ContentBrief, ContentItem } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared";
import { formatShortDate, initials } from "@/lib/format";
import { ContentDetailDialog } from "./content-detail-dialog";
import { CONTENT_STATUS_LABELS, CONTENT_STATUS_ORDER, CONTENT_TYPE_LABELS, seoScoreBadgeClass } from "./labels";

/** Static Kanban board grouped by ContentStatus — drag-and-drop isn't required, columns are fixed. */
export function ContentPlannerBoard({
  items,
  briefs,
  authorsById,
}: {
  items: ContentItem[];
  briefs: ContentBrief[];
  authorsById: Record<string, string>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const selectedBrief = selected ? briefs.find((b) => b.contentItemId === selected.id) : undefined;

  if (items.length === 0) {
    return <EmptyState title="No content yet" description="Add content ideas or generate a draft in the AI Writer to get started." />;
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {CONTENT_STATUS_ORDER.map((status) => {
          const columnItems = items.filter((i) => i.status === status);
          return (
            <div key={status} className="flex w-72 shrink-0 flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold">{CONTENT_STATUS_LABELS[status]}</h3>
                <span className="text-xs text-muted-foreground">{columnItems.length}</span>
              </div>
              <div className="flex min-h-24 flex-col gap-2.5 rounded-xl bg-muted/40 p-2">
                {columnItems.length === 0 ? (
                  <p className="px-2 py-4 text-center text-xs text-muted-foreground">No items</p>
                ) : (
                  columnItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="flex flex-col gap-2 rounded-lg border bg-card p-3 text-left text-sm shadow-sm transition-colors hover:bg-accent/40"
                    >
                      <p className="text-xs font-medium text-muted-foreground">{CONTENT_TYPE_LABELS[item.type]}</p>
                      <p className="line-clamp-2 font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.primaryKeyword}</p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">{initials(authorsById[item.authorId] ?? "?")}</AvatarFallback>
                          </Avatar>
                          {item.dueDate && <span className="text-xs text-muted-foreground">{formatShortDate(item.dueDate)}</span>}
                        </div>
                        {item.seoScore !== null && (
                          <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${seoScoreBadgeClass(item.seoScore)}`}>
                            {item.seoScore}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ContentDetailDialog
        item={selected}
        brief={selectedBrief}
        authorName={selected ? authorsById[selected.authorId] : undefined}
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  );
}
