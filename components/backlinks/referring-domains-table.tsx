"use client";

import type { ReferringDomain } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { referringDomainColumns } from "./referring-domains-columns";

export function ReferringDomainsTable({ data }: { data: ReferringDomain[] }) {
  return (
    <DataTable
      columns={referringDomainColumns}
      data={data}
      searchKey="domain"
      searchPlaceholder="Search referring domains..."
      pageSize={10}
      emptyTitle="No referring domains found"
      emptyDescription="Referring domains will appear here once backlinks are discovered."
    />
  );
}
