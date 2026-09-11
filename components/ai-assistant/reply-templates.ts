import type { StructuredReplySections } from "./types";

export interface TemplatedReply {
  sections: StructuredReplySections;
  suggestedFollowUps: string[];
}

type Theme = "traffic" | "strategy" | "keywords" | "content" | "pages" | "general";

/**
 * Loose keyword classification of the user's question into one of the
 * product's core SEO themes. Checked most-specific-first so overlapping
 * words (e.g. "content" vs "page") resolve to the more precise theme.
 */
function classify(question: string): Theme {
  const q = question.toLowerCase();
  if (q.includes("traffic")) return "traffic";
  if (q.includes("strategy") || q.includes("plan")) return "strategy";
  if (q.includes("keyword")) return "keywords";
  if (q.includes("content") || q.includes("opportunit")) return "content";
  if (q.includes("page") || q.includes("perform") || q.includes("optimi")) return "pages";
  return "general";
}

function buildTemplates(domain: string): Record<Theme, TemplatedReply> {
  return {
    traffic: {
      sections: {
        analysis: `Organic traffic on ${domain} is the metric most likely behind this — recent weeks show sessions dipping while impressions held steady, which usually points to a rankings or SERP-feature issue rather than falling demand.`,
        evidence: `Search Console shows average position slipping across your top 20 pages, and GA4 confirms the drop is concentrated in organic landing pages rather than paid or referral traffic.`,
        priority: "high",
        recommendation: `Pull the Search Console query list sorted by click loss, cross-reference against pages that changed recently, and check whether a competitor now holds a SERP feature (featured snippet, local pack) you previously had.`,
        expectedImpact: "Recovering lost positions typically restores 60-80% of the traffic drop within 2-4 weeks.",
        nextAction: "Review the losing-queries list with your SEO specialist before the next reporting cycle.",
      },
      suggestedFollowUps: ["Which pages lost the most traffic?", "Did a competitor outrank us recently?", "Is this a Google algorithm update?"],
    },
    keywords: {
      sections: {
        analysis: `For ${domain}, the highest-leverage keyword targets right now are the ones sitting just outside page one — they need the least additional effort to move and already have demand behind them.`,
        evidence: `Rank tracking shows several tracked keywords holding positions 11-20 with meaningful search volume, and the opportunity model scores them above 70 based on current content depth and competition.`,
        priority: "opportunity",
        recommendation: `Prioritize keywords where you already have a ranking page — improving title tags, headings, and internal links there is faster than building new content from scratch.`,
        expectedImpact: "Page-two-to-page-one moves typically land within 3-6 weeks of on-page updates.",
        nextAction: "Open Keyword Opportunities and assign the top 3 to this week's sprint.",
      },
      suggestedFollowUps: ["Which pages should I update first?", "Show me the content-gap keywords too.", "What's the fastest keyword win here?"],
    },
    pages: {
      sections: {
        analysis: `The pages worth prioritizing on ${domain} are the ones combining real search visibility with a fixable weakness — thin content, slow load times, or weak internal linking rather than a fundamental relevance problem.`,
        evidence: `The latest crawl flags a handful of pages with title or meta issues, and Core Web Vitals shows a cluster of pages with LCP above the 2.5s target on mobile.`,
        priority: "high",
        recommendation: `Start with pages that already have search visibility and a technical issue — fixing Core Web Vitals and metadata there compounds with existing rankings instead of starting from zero.`,
        expectedImpact: "Resolving Core Web Vitals and metadata gaps typically lifts affected pages by 3-8 positions within a month.",
        nextAction: "Review the SEO Audit issues list and assign the top technical fixes this week.",
      },
      suggestedFollowUps: ["Which Core Web Vitals issue matters most?", "Show me pages with weak internal linking.", "Has a competitor overtaken this page?"],
    },
    content: {
      sections: {
        analysis: `New content opportunities for ${domain} fall into two buckets: topics your competitors rank for that you don't cover at all, and existing pages that have gone stale and lost ground to fresher competing content.`,
        evidence: `The content gap analysis shows competitor pages ranking in the top 5 for topics with no matching page on your site, and a few of your older posts haven't been updated in over a year despite steady search volume.`,
        priority: "opportunity",
        recommendation: `Sequence net-new pieces first since they compound over time, then refresh the highest-traffic ageing post in the same sprint so it doesn't keep losing ground.`,
        expectedImpact: "New topic coverage typically starts ranking within 4-8 weeks; refreshed pages often regain lost positions faster, within 2-4 weeks.",
        nextAction: "Send the top content-gap topic to the AI Writer to draft a brief.",
      },
      suggestedFollowUps: ["Draft an outline for the top opportunity.", "Which competitor is winning this topic?", "What should the refreshed post include?"],
    },
    strategy: {
      sections: {
        analysis: `A focused strategy for ${domain} this month should sequence technical stability first, then content and links — fixes compound faster when the technical foundation is healthy.`,
        evidence: `Current data shows a mix of open technical issues, a few content opportunities already scoped, and backlink outreach targets identified but not yet contacted.`,
        priority: "high",
        recommendation: `Resolve outstanding technical issues first, publish the highest-priority content piece next, then follow up on existing backlink outreach before sourcing new prospects.`,
        expectedImpact: "Following this sequence typically shows measurable SEO health score and traffic movement within 30-60 days.",
        nextAction: "Review this plan with your team and assign owners for each workstream this week.",
      },
      suggestedFollowUps: ["Show me the open technical issues.", "What's blocking the backlink outreach?", "Draft this month's client report summary."],
    },
    general: {
      sections: {
        analysis: `Based on current performance across ${domain}, there are a few areas worth your attention this week — nothing urgent, but each compounds if left unaddressed.`,
        evidence: `The latest crawl, rank tracking, and traffic data are all within normal ranges, with a handful of medium-priority items flagged by the automated analysis.`,
        priority: "medium",
        recommendation: `Review the "Recommended for you" list below for the specific, prioritized actions our analysis surfaced for this website.`,
        expectedImpact: "Addressing medium-priority items typically yields incremental gains over 4-6 weeks.",
        nextAction: "Scan the recommendations below and pick one to assign this week.",
      },
      suggestedFollowUps: [
        "Why did organic traffic drop this month?",
        "Which keywords should we target next?",
        "Give me this month's SEO strategy.",
      ],
    },
  };
}

/** Builds a templated, structured assistant reply for a user's question. Pure — safe to call from a client event handler. */
export function buildReply(question: string, websiteDomain: string): TemplatedReply {
  const theme = classify(question);
  return buildTemplates(websiteDomain)[theme];
}
