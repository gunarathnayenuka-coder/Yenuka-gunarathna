"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCompactNumber, formatShortDate } from "@/lib/format";
import type { GA4Summary } from "@/types";

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  organicSessions: { label: "Organic sessions", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function GA4SessionsChart({ data }: { data: GA4Summary["sessionsSeries"] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatShortDate} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} width={36} fontSize={12} tickFormatter={(v: number) => formatCompactNumber(v)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => formatShortDate(String(v))} indicator="line" />} />
        <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={false} />
        <Line dataKey="organicSessions" type="monotone" stroke="var(--color-organicSessions)" strokeWidth={2} dot={false} />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
