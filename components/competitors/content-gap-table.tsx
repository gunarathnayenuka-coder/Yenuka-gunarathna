"use client";

import { useMemo, useState } from "react";
import type { CompetitorContentGap } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentGapColumns } from "./content-gap-columns";

const COVERAGE_FILTERS = { all: "All topics", gaps: "Gaps only", covered: "Covered only" } as const;
type CoverageFilter = keyof typeof COVERAGE_FILTERS;

export function ContentGapTable({ data }: { data: CompetitorContentGap[] }) {
  const [filter, setFilter] = useState<CoverageFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "gaps") return data.filter((g) => !g.weCoverTopic);
    if (filter === "covered") return data.filter((g) => g.weCoverTopic);
    return data;
  }, [data, filter]);

  return (
    <DataTable
      columns={contentGapColumns}
      data={filtered}
      searchKey="topic"
      searchPlaceholder="Search topics..."
      pageSize={10}
      emptyTitle="No content gaps found"
      emptyDescription="Try a different search term or coverage filter."
      toolbar={
        <Select value={filter} onValueChange={(value) => setFilter((value as CoverageFilter | null) ?? "all")}>
          <SelectTrigger size="sm" className="w-full sm:w-40">
            <SelectValue placeholder="All topics">
              {(value: string | null) => COVERAGE_FILTERS[(value as CoverageFilter | null) ?? "all"]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(COVERAGE_FILTERS) as CoverageFilter[]).map((key) => (
              <SelectItem key={key} value={key}>
                {COVERAGE_FILTERS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
