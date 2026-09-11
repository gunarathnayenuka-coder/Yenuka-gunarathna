"use client";

import { useMemo } from "react";
import type { Competitor, CompetitorKeywordGap } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { buildKeywordGapColumns } from "./keyword-gap-columns";

export function KeywordGapTable({ data, competitors }: { data: CompetitorKeywordGap[]; competitors: Competitor[] }) {
  const columns = useMemo(() => buildKeywordGapColumns(new Map(competitors.map((c) => [c.id, c]))), [competitors]);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="keyword"
      searchPlaceholder="Search keywords..."
      pageSize={10}
      emptyTitle="No keyword gaps found"
      emptyDescription="Keyword gaps will appear here once competitor ranking data is available."
    />
  );
}
