"use client";

import { useMemo, useState } from "react";
import type { ContentAuditFinding, ContentBrief, ContentItem } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { ContentDetailDialog } from "./content-detail-dialog";
import { buildContentAuditColumns } from "./audit-columns";

export function ContentAuditTable({
  data,
  contentItems,
  briefs,
  authorsById,
}: {
  data: ContentAuditFinding[];
  contentItems: ContentItem[];
  briefs: ContentBrief[];
  authorsById: Record<string, string>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = contentItems.find((i) => i.id === selectedId) ?? null;
  const selectedBrief = selected ? briefs.find((b) => b.contentItemId === selected.id) : undefined;

  const contentTitleById = useMemo(() => new Map(contentItems.map((c) => [c.id, c.title])), [contentItems]);
  const columns = useMemo(() => buildContentAuditColumns(contentTitleById, setSelectedId), [contentTitleById]);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="issue"
        searchPlaceholder="Search audit findings..."
        pageSize={10}
        emptyTitle="No audit findings"
        emptyDescription="Published content on this website has no flagged issues right now."
      />
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
