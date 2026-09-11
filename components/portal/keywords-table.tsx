"use client";

import type { Keyword } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { portalKeywordColumns } from "./keyword-columns";

export function PortalKeywordsTable({ data }: { data: Keyword[] }) {
  return (
    <DataTable
      columns={portalKeywordColumns}
      data={data}
      searchKey="keyword"
      searchPlaceholder="Search keywords..."
      pageSize={10}
      emptyTitle="No keywords tracked yet"
      emptyDescription="Keywords will show up here once tracking begins."
    />
  );
}
