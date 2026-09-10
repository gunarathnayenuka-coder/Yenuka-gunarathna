import Link from "next/link";
import type { Keyword } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared";
import { formatCompactNumber, formatRank } from "@/lib/format";
import { IntentBadge } from "./intent-badge";

/** Top opportunity-scored keywords for the current website — a quick "what to work on next" list. */
export function PriorityKeywordsCard({ keywords, websiteId }: { keywords: Keyword[]; websiteId: string }) {
  const top = [...keywords].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔥 Priority keywords</CardTitle>
        <CardDescription>Highest opportunity-scored keywords to act on first.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" render={<Link href={`/keywords/opportunities?site=${websiteId}`} />}>
            View all opportunities
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {top.length === 0 ? (
          <EmptyState title="No priority keywords yet" description="Opportunity scores will appear once keywords are tracked." />
        ) : (
          top.map((k, i) => (
            <div key={k.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{k.keyword}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatCompactNumber(k.volume)} searches/mo · Rank {formatRank(k.currentRank)}
                </p>
              </div>
              <IntentBadge intent={k.intent} className="hidden sm:inline-flex" />
              <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums">{k.opportunityScore}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
