"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import type { SEOIssue } from "@/types";
import { buildIssueColumns } from "./issues-columns";
import { IssueDetailSheet } from "./issue-detail-sheet";

export function IssuesTable({
  data,
  emptyTitle = "No issues found",
  emptyDescription = "Try adjusting your filters or search term.",
}: {
  data: SEOIssue[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [selectedIssue, setSelectedIssue] = useState<SEOIssue | null>(null);
  const columns = useMemo(() => buildIssueColumns((issue) => setSelectedIssue(issue)), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search issues..."
        pageSize={10}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
      <IssueDetailSheet issue={selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} />
    </>
  );
}
