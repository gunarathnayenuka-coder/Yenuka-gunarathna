import type { AIConversation, AIRecommendation, RecommendationPriority } from "@/types";
import { chance, daysAgo, pick, randInt, rngFor } from "./rng";
import { websites } from "./websites";
import { getIssuesByWebsite } from "./seo-issues";
import { keywordOpportunities } from "./keywords";
import { cannibalizationIssues } from "./keywords";
import { AI_PROMPT_STARTERS } from "@/types";

function severityToPriority(severity: "critical" | "high" | "medium" | "low"): RecommendationPriority {
  return severity;
}

export const aiRecommendations: AIRecommendation[] = websites.flatMap((website) => {
  const rng = rngFor(`ai-rec-${website.id}`);
  const items: AIRecommendation[] = [];
  let seq = 0;
  const nextId = () => `${website.id}_ai_${(seq++).toString().padStart(3, "0")}`;

  const openIssues = getIssuesByWebsite(website.id)
    .filter((issue) => issue.status === "open" || issue.status === "in_progress")
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "critical" ? -1 : 1))
    .slice(0, 3);

  for (const issue of openIssues) {
    items.push({
      id: nextId(),
      websiteId: website.id,
      priority: severityToPriority(issue.severity),
      category: issue.category === "content" ? "content" : issue.category === "performance" ? "performance" : "technical",
      title: issue.title,
      reason: issue.description,
      recommendation: issue.recommendation,
      impact: issue.severity === "critical" || issue.severity === "high" ? "high" : "medium",
      effort: chance(rng, 0.5) ? "low" : "medium",
      relatedUrl: issue.url,
      status: "new",
      createdAt: issue.detectedAt,
    });
  }

  const opportunities = keywordOpportunities.filter((o) => o.websiteId === website.id).slice(0, 2);
  for (const opp of opportunities) {
    items.push({
      id: nextId(),
      websiteId: website.id,
      priority: opp.opportunityScore > 80 ? "high" : "opportunity",
      category: "keywords",
      title:
        opp.suggestedAction === "create_content"
          ? `Create content targeting "${opp.keyword}"`
          : `Optimize the page ranking for "${opp.keyword}"`,
      reason: opp.reason,
      recommendation:
        opp.suggestedAction === "create_content"
          ? `Brief and publish a page targeting "${opp.keyword}" (${opp.volume.toLocaleString()} monthly searches).`
          : `Improve title, headings, and internal links on ${opp.suggestedUrl ?? "the target page"} to climb the SERP.`,
      impact: opp.opportunityScore > 75 ? "high" : "medium",
      effort: opp.suggestedAction === "create_content" ? "high" : "low",
      relatedUrl: opp.suggestedUrl,
      status: "new",
      createdAt: daysAgo(randInt(rng, 0, 5)),
    });
  }

  const cannibalization = cannibalizationIssues.find((c) => c.websiteId === website.id);
  if (cannibalization) {
    items.push({
      id: nextId(),
      websiteId: website.id,
      priority: "medium",
      category: "content",
      title: `Resolve keyword cannibalization for "${cannibalization.keyword}"`,
      reason: `${cannibalization.urls.length} pages are competing for the same keyword, splitting ranking signals.`,
      recommendation: cannibalization.recommendation,
      impact: "medium",
      effort: "medium",
      relatedUrl: cannibalization.recommendedPrimaryUrl,
      status: "new",
      createdAt: cannibalization.detectedAt,
    });
  }

  if (website.organicTrafficChangePct < -5) {
    items.push({
      id: nextId(),
      websiteId: website.id,
      priority: "high",
      category: "performance",
      title: "Investigate organic traffic decline",
      reason: `Organic traffic is down ${Math.abs(website.organicTrafficChangePct).toFixed(1)}% versus the previous period.`,
      recommendation: "Review Search Console for losing queries, check for technical regressions, and compare against algorithm update timing.",
      impact: "high",
      effort: "medium",
      status: "new",
      createdAt: daysAgo(1),
    });
  }

  return items;
});

export function getRecommendationsByWebsite(websiteId: string): AIRecommendation[] {
  return aiRecommendations.filter((r) => r.websiteId === websiteId);
}

const PRIORITY_RANK: Record<RecommendationPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  opportunity: 4,
};

export function sortByPriority(items: AIRecommendation[]): AIRecommendation[] {
  return [...items].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
}

export const aiConversations: AIConversation[] = [
  {
    id: "convo_0001",
    title: "Why did traffic drop last week?",
    messages: [
      {
        id: "msg_0001",
        role: "user",
        content: "Why did traffic drop last week?",
        createdAt: daysAgo(2),
      },
      {
        id: "msg_0002",
        role: "assistant",
        content:
          "Organic sessions fell 8.4% week over week, concentrated on 6 blog URLs that lost featured snippets on Sept 3. Search Console shows average position slipped from 3.2 to 5.8 for their target queries, while impressions stayed flat — this points to a SERP layout change rather than a technical issue on your site.",
        citations: [{ label: "Search Console — Performance report" }, { label: "GA4 — Landing page report" }],
        suggestedFollowUps: [
          "Which queries lost the most clicks?",
          "Did a competitor start outranking us?",
          "What should we fix first?",
        ],
        createdAt: daysAgo(2),
      },
    ],
    updatedAt: daysAgo(2),
  },
];

export { AI_PROMPT_STARTERS };
export function pickPromptStarter(seed: string) {
  const rng = rngFor(`starter-${seed}`);
  return pick(rng, AI_PROMPT_STARTERS);
}
