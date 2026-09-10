"use client";

import { DataTable } from "@/components/shared/data-table";
import { cwvColumns } from "./cwv-columns";
import type { WebsitePage } from "@/types";

export function CwvTable({ data }: { data: WebsitePage[] }) {
  return (
    <DataTable
      columns={cwvColumns}
      data={data}
      searchKey="path"
      searchPlaceholder="Search pages..."
      pageSize={8}
      emptyTitle="No page-level performance data yet"
      emptyDescription="Run a crawl to capture Core Web Vitals for each page."
    />
  );
}
