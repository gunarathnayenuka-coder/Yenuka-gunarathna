"use client";

import { DataTable } from "@/components/shared/data-table";
import { websitePageColumns } from "./pages-columns";
import type { WebsitePage } from "@/types";

export function WebsitePagesTable({ data }: { data: WebsitePage[] }) {
  return (
    <DataTable
      columns={websitePageColumns}
      data={data}
      searchKey="path"
      searchPlaceholder="Search pages..."
      pageSize={10}
      emptyTitle="No pages crawled yet"
      emptyDescription="Run a crawl to discover this website's pages."
    />
  );
}
