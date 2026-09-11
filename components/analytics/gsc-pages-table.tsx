"use client";

import { DataTable } from "@/components/shared/data-table";
import type { GSCPageRow } from "@/types";
import { gscPageColumns } from "./gsc-page-columns";

export function GSCPagesTable({ data }: { data: GSCPageRow[] }) {
  return (
    <DataTable
      columns={gscPageColumns}
      data={data}
      searchKey="url"
      searchPlaceholder="Search pages..."
      pageSize={10}
      emptyTitle="No page data yet"
      emptyDescription="Search Console data will appear here once available."
    />
  );
}
