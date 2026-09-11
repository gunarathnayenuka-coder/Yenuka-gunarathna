"use client";

import type { LinkOpportunity } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { linkOpportunityColumns } from "./opportunities-columns";

export function LinkOpportunitiesTable({ data }: { data: LinkOpportunity[] }) {
  return (
    <DataTable
      columns={linkOpportunityColumns}
      data={data}
      searchKey="targetDomain"
      searchPlaceholder="Search target domains..."
      pageSize={10}
      emptyTitle="No link opportunities found"
      emptyDescription="New outreach opportunities will appear here as they're discovered."
    />
  );
}
