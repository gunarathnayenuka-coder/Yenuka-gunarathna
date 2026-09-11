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
  {
    id: "convo_0002",
    title: "Which keywords should we target next?",
    messages: [
      {
        id: "msg_0003",
        role: "user",
        content: "Which keywords should we target next?",
        createdAt: daysAgo(1),
      },
      {
        id: "msg_0004",
        role: "assistant",
        content:
          "I'd prioritize 8 keywords sitting in positions 11-20 — these are the fastest wins since you're already ranking on page two. \"emergency plumber colombo\" (2,400 monthly searches, position 14) and \"affordable dental implants sri lanka\" (1,100 searches, position 12) have the strongest opportunity scores because you already have pages with decent content depth, just thin on internal links and structured data. I'd also flag 3 keywords where a competitor ranks but you have no page at all yet — those need net-new content rather than optimization, so they're a longer play.",
        citations: [{ label: "Keyword Opportunities report" }, { label: "Rank Tracking — last 30 days" }],
        suggestedFollowUps: [
          "Which pages should I update first?",
          "What's the fastest keyword win here?",
          "Show me the content-gap keywords too.",
        ],
        createdAt: daysAgo(1),
      },
    ],
    updatedAt: daysAgo(1),
  },
  {
    id: "convo_0003",
    title: "Find new content opportunities",
    messages: [
      {
        id: "msg_0005",
        role: "user",
        content: "Find new content opportunities for us.",
        createdAt: daysAgo(3),
      },
      {
        id: "msg_0006",
        role: "assistant",
        content:
          "I found 6 content opportunities worth prioritizing this month. Three are keyword gaps where your top competitor ranks in the top 5 but you have no page targeting the topic at all — the strongest is a comparison-style guide around \"SEO agency pricing in Sri Lanka\" (720 monthly searches, low competition). Two more are refresh opportunities: your \"local SEO checklist\" post from 14 months ago is still ranking on page one but has slipped 2 positions as competitors published longer, more current versions. I'd sequence the net-new pieces first since they compound over time, then refresh the ageing post in the same sprint.",
        citations: [{ label: "Content Gap Analysis" }, { label: "Competitor keyword-gap report" }],
        suggestedFollowUps: [
          "Draft an outline for the pricing guide.",
          "What should the refreshed checklist include?",
          "Which competitor is winning this keyword?",
        ],
        createdAt: daysAgo(3),
      },
    ],
    updatedAt: daysAgo(3),
  },
  {
    id: "convo_0004",
    title: "Why is this page not performing?",
    messages: [
      {
        id: "msg_0007",
        role: "user",
        content: "Why is this page not performing?",
        createdAt: daysAgo(5),
      },
      {
        id: "msg_0008",
        role: "assistant",
        content:
          "Looking at your lowest-performing indexed page, /services/teeth-whitening has dropped from position 6 to position 19 over the last 6 weeks while impressions stayed roughly flat — that pattern usually means a relevance or quality signal issue rather than lost demand. The page hasn't been updated in 11 months, it now has only 2 internal links pointing to it (down from 5 after a recent navigation change), and its Core Web Vitals show an LCP of 4.1s on mobile, well above the 2.5s target. Any one of these could cause a slide this size, but the combination of thin internal linking and poor LCP is the most likely driver based on how similar pages on your site have recovered before.",
        citations: [
          { label: "Search Console — Page performance" },
          { label: "Core Web Vitals report" },
          { label: "Internal Links audit" },
        ],
        suggestedFollowUps: [
          "How do I fix the Core Web Vitals issue?",
          "Which pages should link to this one?",
          "Has a competitor overtaken this keyword?",
        ],
        createdAt: daysAgo(5),
      },
    ],
    updatedAt: daysAgo(5),
  },
  {
    id: "convo_0005",
    title: "This month's SEO strategy",
    messages: [
      {
        id: "msg_0009",
        role: "user",
        content: "Give me this month's SEO strategy.",
        createdAt: daysAgo(9),
      },
      {
        id: "msg_0010",
        role: "assistant",
        content:
          "Here's where I'd focus this month, in priority order. First, technical: 4 pages are throwing intermittent 500 errors during crawl — get those stable before anything else, since crawl errors suppress everything downstream. Second, content: publish the 2 content-gap pieces scoped last week to capture the keywords your top competitor already owns. Third, links: you have 5 outreach targets marked but not yet contacted from last month — following up on those is higher-leverage than sourcing new prospects right now. Fourth, reporting: the monthly client report is due in 6 days and traffic is trending up 6.2%, so lead with that when you send it. If you only do one thing this week, fix the crawl errors — everything else compounds on top of a healthy technical baseline.",
        citations: [
          { label: "Technical SEO — crawl issues" },
          { label: "Content Planner" },
          { label: "Backlink Opportunities" },
        ],
        suggestedFollowUps: [
          "Show me the pages with crawl errors.",
          "What's blocking the outreach follow-ups?",
          "Draft the client report summary.",
        ],
        createdAt: daysAgo(9),
      },
    ],
    updatedAt: daysAgo(9),
  },
];

export function getConversationById(id: string): AIConversation | undefined {
  return aiConversations.find((c) => c.id === id);
}

export { AI_PROMPT_STARTERS };
export function pickPromptStarter(seed: string) {
  const rng = rngFor(`starter-${seed}`);
  return pick(rng, AI_PROMPT_STARTERS);
}
