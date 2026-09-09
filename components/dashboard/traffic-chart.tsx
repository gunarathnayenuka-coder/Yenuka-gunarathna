"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatShortDate } from "@/lib/format";
import type { TrafficHistoryPoint } from "@/lib/mock-data";

const chartConfig = {
  organicTraffic: {
    label: "Organic traffic",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TrafficChart({ data }: { data: TrafficHistoryPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillTraffic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-organicTraffic)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-organicTraffic)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatShortDate}
          fontSize={12}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelFormatter={(v) => formatShortDate(String(v))} indicator="dot" />}
        />
        <Area
          dataKey="organicTraffic"
          type="monotone"
          fill="url(#fillTraffic)"
          stroke="var(--color-organicTraffic)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
