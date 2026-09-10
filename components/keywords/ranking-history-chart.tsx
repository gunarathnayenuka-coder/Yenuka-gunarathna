"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { Keyword } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared";
import { formatShortDate } from "@/lib/format";

const chartConfig = {
  rank: {
    label: "Rank",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/** Rank-over-time line chart for one keyword at a time, picked from a representative subset. Lower rank is better, so the Y axis is reversed. */
export function RankingHistoryChart({ keywords }: { keywords: Keyword[] }) {
  const [selectedId, setSelectedId] = useState<string>(keywords[0]?.id ?? "");
  const selected = keywords.find((k) => k.id === selectedId) ?? keywords[0];

  const domainMax = useMemo(() => {
    if (!selected) return 20;
    const ranks = selected.rankingHistory.map((p) => p.rank).filter((r): r is number => r !== null);
    return ranks.length ? Math.max(10, Math.max(...ranks) + 2) : 20;
  }, [selected]);

  if (!selected) {
    return <EmptyState title="No keywords to chart" description="Track keywords to see their ranking history over time." />;
  }

  return (
    <div className="space-y-3">
      <Select value={selected.id} onValueChange={(value) => value && setSelectedId(value)}>
        <SelectTrigger className="w-full sm:w-72">
          <SelectValue placeholder="Choose a keyword">
            {(value: string | null) => keywords.find((k) => k.id === value)?.keyword ?? "Choose a keyword"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {keywords.map((k) => (
            <SelectItem key={k.id} value={k.id}>
              {k.keyword}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ChartContainer config={chartConfig} className="h-64 w-full">
        <LineChart data={selected.rankingHistory} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatShortDate} fontSize={12} />
          <YAxis
            reversed
            domain={[1, domainMax]}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={28}
            fontSize={12}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent labelFormatter={(v) => formatShortDate(String(v))} indicator="line" />}
          />
          <Line dataKey="rank" type="monotone" stroke="var(--color-rank)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">Lower is better — the axis is inverted so upward movement on the chart means a better rank.</p>
    </div>
  );
}
