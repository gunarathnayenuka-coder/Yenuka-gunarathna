"use client";

import { DataTable } from "@/components/shared/data-table";
import type { GA4LandingPage } from "@/types";
import { ga4LandingPageColumns } from "./ga4-landing-page-columns";

export function GA4LandingPagesTable({ data }: { data: GA4LandingPage[] }) {
  return (
    <DataTable
      columns={ga4LandingPageColumns}
      data={data}
      searchKey="url"
      searchPlaceholder="Search landing pages..."
      pageSize={10}
      emptyTitle="No landing page data yet"
      emptyDescription="Google Analytics data will appear here once available."
    />
  );
}
