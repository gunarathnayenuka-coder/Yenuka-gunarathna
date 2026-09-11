"use client";

import { DataTable } from "@/components/shared/data-table";
import type { GSCQueryRow } from "@/types";
import { gscQueryColumns } from "./gsc-query-columns";

export function GSCQueriesTable({ data }: { data: GSCQueryRow[] }) {
  return (
    <DataTable
      columns={gscQueryColumns}
      data={data}
      searchKey="query"
      searchPlaceholder="Search queries..."
      pageSize={10}
      emptyTitle="No query data yet"
      emptyDescription="Search Console data will appear here once available."
    />
  );
}
