import { Gauge, Timer, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./priority-badge";
import type { AIRecommendation } from "@/types";

const CATEGORY_LABELS: Record<AIRecommendation["category"], string> = {
  technical: "Technical",
  content: "Content",
  keywords: "Keywords",
  links: "Links",
  performance: "Performance",
  local: "Local SEO",
};

export function AIRecommendationCard({ recommendation }: { recommendation: AIRecommendation }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border p-3.5 transition-colors hover:bg-accent/40 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={recommendation.priority} />
          <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[recommendation.category]}</span>
        </div>
        <p className="text-sm font-medium text-foreground">{recommendation.title}</p>
        <p className="text-sm text-muted-foreground">{recommendation.recommendation}</p>
        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Gauge className="size-3.5" /> Impact: <span className="font-medium capitalize text-foreground">{recommendation.impact}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer className="size-3.5" /> Effort: <span className="font-medium capitalize text-foreground">{recommendation.effort}</span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-start">
        {recommendation.relatedUrl && (
          <Button variant="outline" size="sm" render={<a href={recommendation.relatedUrl} target="_blank" rel="noreferrer" />}>
            <ExternalLink /> View page
          </Button>
        )}
      </div>
    </div>
  );
}
