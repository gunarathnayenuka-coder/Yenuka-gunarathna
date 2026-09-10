"use client";

import { useState } from "react";
import type { ContentBrief, ContentItem } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared";
import { formatRelativeTime, initials } from "@/lib/format";
import { ContentStatusBadge } from "./content-status-badge";
import { ContentDetailDialog } from "./content-detail-dialog";
import { seoScoreTextClass } from "./labels";

export function RecentContentList({
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
      <div className="divide-y">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-colors hover:bg-accent/50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{initials(authorsById[item.authorId] ?? "?")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.primaryKeyword} · Updated {formatRelativeTime(item.updatedAt)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`w-8 text-right text-sm font-semibold tabular-nums ${seoScoreTextClass(item.seoScore)}`}>
                {item.seoScore ?? "—"}
              </span>
              <ContentStatusBadge status={item.status} />
            </div>
          </button>
        ))}
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
