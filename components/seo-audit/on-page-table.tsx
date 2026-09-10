"use client";

import { DataTable } from "@/components/shared/data-table";
import { onPageColumns } from "./on-page-columns";
import type { WebsitePage } from "@/types";

export function OnPageTable({ data }: { data: WebsitePage[] }) {
  return (
    <DataTable
      columns={onPageColumns}
      data={data}
      searchKey="path"
      searchPlaceholder="Search pages..."
      pageSize={10}
      emptyTitle="No pages crawled yet"
      emptyDescription="Run a crawl to discover this website's pages and surface on-page issues."
    />
  );
}
