"use client";

import { DataTable } from "@/components/shared/data-table";
import { clientColumns } from "./columns";
import type { Client } from "@/types";

export function ClientsTable({ data }: { data: Client[] }) {
  return (
    <DataTable
      columns={clientColumns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search clients..."
      pageSize={8}
      emptyTitle="No clients yet"
      emptyDescription="Add your first client to start tracking their SEO performance."
    />
  );
}
