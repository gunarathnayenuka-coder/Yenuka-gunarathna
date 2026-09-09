"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatShortDate } from "@/lib/format";
import type { SEOScoreHistoryPoint } from "@/types";

const chartConfig = {
  overall: {
    label: "SEO health score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function HealthTrendChart({ data }: { data: SEOScoreHistoryPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatShortDate} fontSize={12} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={28} fontSize={12} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelFormatter={(v) => formatShortDate(String(v))} indicator="line" />}
        />
        <Line dataKey="overall" type="monotone" stroke="var(--color-overall)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
