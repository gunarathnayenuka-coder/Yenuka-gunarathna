"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCompactNumber, formatShortDate } from "@/lib/format";
import type { GSCSummary } from "@/types";

const chartConfig = {
  clicks: { label: "Clicks", color: "var(--chart-1)" },
  impressions: { label: "Impressions", color: "var(--chart-3)" },
} satisfies ChartConfig;

/** Clicks vs. impressions over time — a single shared axis (never a dual-axis chart) since both series are the same order of magnitude. */
export function GSCClicksChart({ data }: { data: GSCSummary["clicksSeries"] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatShortDate} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} width={36} fontSize={12} tickFormatter={(v: number) => formatCompactNumber(v)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => formatShortDate(String(v))} indicator="line" />} />
        <Line dataKey="clicks" type="monotone" stroke="var(--color-clicks)" strokeWidth={2} dot={false} />
        <Line dataKey="impressions" type="monotone" stroke="var(--color-impressions)" strokeWidth={2} dot={false} />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
