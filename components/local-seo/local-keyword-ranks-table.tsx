"use client";

import { DataTable } from "@/components/shared/data-table";
import type { LocalKeywordRank } from "@/types";
import { localKeywordRankColumns } from "./local-keyword-ranks-columns";

export function LocalKeywordRanksTable({ data }: { data: LocalKeywordRank[] }) {
  return (
    <DataTable
      columns={localKeywordRankColumns}
      data={data}
      searchKey="keyword"
      searchPlaceholder="Search local keywords..."
      pageSize={10}
      emptyTitle="No local keywords tracked"
      emptyDescription="Track local keyword rankings to see map pack and organic position here."
    />
  );
}
