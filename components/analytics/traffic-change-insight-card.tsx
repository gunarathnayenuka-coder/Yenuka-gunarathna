import { Lightbulb } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeIndicator } from "@/components/shared/trend-indicator";
import type { TrafficChangeInsight } from "@/types";

/** "Why did traffic change?" narrative callout — styled like the dashboard's AI recommendations card. */
export function TrafficChangeInsightCard({ insight }: { insight: TrafficChangeInsight }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4" /> Why did traffic change?
        </CardTitle>
        <CardDescription>AI-generated insight based on recent performance data.</CardDescription>
        <CardAction>
          <ChangeIndicator pct={insight.changePct} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium text-foreground">{insight.headline}</p>

        <div>
          <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">Main reasons</p>
          <ul className="space-y-1.5">
            {insight.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Recommended action</p>
          <p className="mt-1 text-sm text-foreground">{insight.recommendedAction}</p>
        </div>
      </CardContent>
    </Card>
  );
}
