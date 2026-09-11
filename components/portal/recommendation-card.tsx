import { PriorityBadge } from "@/components/shared";
import type { AIRecommendation } from "@/types";

const CATEGORY_LABELS: Record<AIRecommendation["category"], string> = {
  technical: "Technical",
  content: "Content",
  keywords: "Keywords",
  links: "Links",
  performance: "Performance",
  local: "Local SEO",
};

/**
 * A simplified, client-facing version of `AIRecommendationCard` — priority,
 * category and plain-language copy only, no effort/impact jargon.
 */
export function PortalRecommendationCard({ recommendation }: { recommendation: AIRecommendation }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={recommendation.priority} />
        <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[recommendation.category]}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{recommendation.title}</p>
      <p className="text-sm text-muted-foreground">{recommendation.recommendation}</p>
    </div>
  );
}
