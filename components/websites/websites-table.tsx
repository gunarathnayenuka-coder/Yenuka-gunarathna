"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/shared/data-table";
import { buildWebsiteColumns } from "./columns";
import type { Client, Website } from "@/types";

export function WebsitesTable({ data, clients }: { data: Website[]; clients: Client[] }) {
  const columns = useMemo(() => buildWebsiteColumns(new Map(clients.map((c) => [c.id, c]))), [clients]);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="domain"
      searchPlaceholder="Search websites..."
      pageSize={8}
      emptyTitle="No websites yet"
      emptyDescription="Add a website to start crawling and tracking its SEO performance."
    />
  );
}
