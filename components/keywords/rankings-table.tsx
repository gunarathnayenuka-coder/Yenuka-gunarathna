"use client";

import { useMemo } from "react";
import type { Keyword } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { rankingsColumns } from "./rankings-columns";

/** Biggest movers first: "new"/"lost" keywords, then the largest rank swings. */
function movementPriority(k: Keyword): number {
  if (k.trend === "new" || k.trend === "lost") return Number.POSITIVE_INFINITY;
  if (k.currentRank === null || k.previousRank === null) return 0;
  return Math.abs(k.previousRank - k.currentRank);
}

export function RankingsTable({ data }: { data: Keyword[] }) {
  const sorted = useMemo(() => [...data].sort((a, b) => movementPriority(b) - movementPriority(a)), [data]);

  return (
    <DataTable
      columns={rankingsColumns}
      data={sorted}
      searchKey="keyword"
      searchPlaceholder="Search keywords..."
      pageSize={10}
      emptyTitle="No ranked keywords"
      emptyDescription="Rank movement will appear here once keywords have ranking history."
    />
  );
}
