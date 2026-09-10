"use client";

import type { KeywordOpportunity } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { opportunityColumns } from "./opportunities-columns";

export function OpportunitiesTable({ data }: { data: KeywordOpportunity[] }) {
  return (
    <DataTable
      columns={opportunityColumns}
      data={data}
      searchKey="keyword"
      searchPlaceholder="Search opportunities..."
      pageSize={10}
      emptyTitle="No opportunities found"
      emptyDescription="High-opportunity keywords will show up here once enough keyword data is tracked."
    />
  );
}
