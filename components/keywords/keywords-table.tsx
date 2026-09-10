"use client";

import { useMemo, useState } from "react";
import type { Keyword, SearchIntent } from "@/types";
import { SEARCH_INTENTS } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INTENT_LABELS } from "@/lib/labels";
import { keywordColumns } from "./columns";

const ALL_INTENTS = "all";

export function KeywordsTable({ data }: { data: Keyword[] }) {
  const [intentFilter, setIntentFilter] = useState<string>(ALL_INTENTS);

  const filtered = useMemo(() => {
    if (intentFilter === ALL_INTENTS) return data;
    return data.filter((k) => k.intent === intentFilter);
  }, [data, intentFilter]);

  return (
    <DataTable
      columns={keywordColumns}
      data={filtered}
      searchKey="keyword"
      searchPlaceholder="Search keywords..."
      pageSize={10}
      emptyTitle="No keywords found"
      emptyDescription="Try a different search term or intent filter."
      toolbar={
        <Select value={intentFilter} onValueChange={(value) => setIntentFilter(value ?? ALL_INTENTS)}>
          <SelectTrigger size="sm" className="w-full sm:w-44">
            <SelectValue placeholder="All intents">
              {(value: string | null) =>
                !value || value === ALL_INTENTS ? "All intents" : INTENT_LABELS[value as SearchIntent]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_INTENTS}>All intents</SelectItem>
            {SEARCH_INTENTS.map((intent: SearchIntent) => (
              <SelectItem key={intent} value={intent}>
                {INTENT_LABELS[intent]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
