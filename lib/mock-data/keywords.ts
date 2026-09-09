import type { CannibalizationIssue, Keyword, KeywordOpportunity, SearchIntent, TrendDirection } from "@/types";
import { SEARCH_INTENTS } from "@/types";
import { chance, daysAgo, pick, randFloat, randInt, rngFor } from "./rng";
import { SEO_SERVICE_HEADS_BY_INDUSTRY, SEO_TOPIC_MODIFIERS } from "./constants";
import { websites } from "./websites";
import { clients } from "./clients";
import { getPagesByWebsite } from "./websites";

const INTENT_BY_MODIFIER: Record<string, SearchIntent> = {
  "near me": "commercial",
  "in {city}": "commercial",
  cost: "commercial",
  price: "commercial",
  reviews: "commercial",
  best: "commercial",
  vs: "commercial",
  "for beginners": "informational",
  guide: "informational",
  services: "transactional",
  company: "transactional",
  consultant: "transactional",
};

function trendFor(rng: ReturnType<typeof rngFor>, current: number | null, previous: number | null): TrendDirection {
  if (current === null) return "lost";
  if (previous === null) return "new";
  if (current < previous) return "up";
  if (current > previous) return "down";
  return chance(rng, 0.5) ? "flat" : "flat";
}

export const keywords: Keyword[] = websites.flatMap((website) => {
  const rng = rngFor(`keywords-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"];
  const pages = getPagesByWebsite(website.id);
  const count = randInt(rng, 26, 55);
  const city = client.address?.city ?? "Colombo";

  const used = new Set<string>();

  return Array.from({ length: count }, (_, i) => {
    let phrase = "";
    let attempts = 0;
    do {
      const head = pick(rng, serviceHeads);
      const modifier = pick(rng, SEO_TOPIC_MODIFIERS);
      phrase = `${head} ${modifier.replace("{city}", city)}`.trim();
      attempts++;
    } while (used.has(phrase) && attempts < 8);
    used.add(phrase);

    const modifierMatch = Object.keys(INTENT_BY_MODIFIER).find((m) => phrase.includes(m.replace("{city}", city)));
    const intent = modifierMatch ? INTENT_BY_MODIFIER[modifierMatch] : pick(rng, SEARCH_INTENTS);
    const volume = randInt(rng, 40, 14000);
    const difficulty = randInt(rng, 8, 88);
    const isRanked = chance(rng, 0.72);
    const currentRank = isRanked ? randInt(rng, 1, 98) : null;
    const previousRank = isRanked && chance(rng, 0.75) ? Math.max(1, currentRank! + randInt(rng, -9, 9)) : currentRank;
    const businessRelevance = intent === "commercial" || intent === "transactional" ? randInt(rng, 60, 100) : randInt(rng, 20, 70);
    const opportunityScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (Math.log10(volume + 1) / 4.2) * 30 +
            businessRelevance * 0.35 +
            (100 - difficulty) * 0.25 +
            (currentRank === null ? 10 : currentRank > 10 ? 15 : 5),
        ),
      ),
    );
    const page = pages.length > 0 && isRanked ? pick(rng, pages) : undefined;
    const history = Array.from({ length: 8 }, (_, h) => ({
      date: daysAgo((7 - h) * 14),
      rank: currentRank === null ? null : Math.max(1, currentRank + randInt(rng, -6, 6)),
    }));

    return {
      id: `${website.id}_kw_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      keyword: phrase,
      intent,
      volume,
      difficulty,
      cpc: randFloat(rng, 0.2, 12, 2),
      currentRank,
      previousRank,
      bestRank: currentRank === null ? null : Math.max(1, currentRank - randInt(rng, 0, 8)),
      url: page ? page.url : null,
      trend: trendFor(rng, currentRank, previousRank),
      opportunityScore,
      isTracked: true,
      tags: intent === "commercial" ? ["priority"] : [],
      rankingHistory: history,
      updatedAt: daysAgo(randInt(rng, 0, 2)),
    };
  });
});

export function getKeywordsByWebsite(websiteId: string): Keyword[] {
  return keywords.filter((k) => k.websiteId === websiteId);
}

export const keywordOpportunities: KeywordOpportunity[] = websites.flatMap((website) => {
  const rng = rngFor(`kw-opp-${website.id}`);
  const websiteKeywords = getKeywordsByWebsite(website.id)
    .filter((k) => k.opportunityScore > 55)
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, randInt(rng, 6, 12));

  return websiteKeywords.map((k, i) => ({
    id: `${website.id}_oppo_${i}`,
    websiteId: website.id,
    keyword: k.keyword,
    volume: k.volume,
    difficulty: k.difficulty,
    intent: k.intent,
    currentRank: k.currentRank,
    opportunityScore: k.opportunityScore,
    reason:
      k.currentRank === null
        ? "High-volume keyword with no ranking page yet — a clear content gap."
        : k.currentRank > 10
          ? "Ranking on page 2 with strong search volume — small optimizations could push into the top 10."
          : "Already ranking well; strengthening this page could reach the top 3.",
    suggestedUrl: k.url ?? undefined,
    suggestedAction: k.currentRank === null ? "create_content" : k.currentRank > 20 ? "build_links" : "optimize_existing",
  }));
});

export const cannibalizationIssues: CannibalizationIssue[] = websites.flatMap((website) => {
  const rng = rngFor(`cannibal-${website.id}`);
  const pages = getPagesByWebsite(website.id);
  if (pages.length < 3 || !chance(rng, 0.7)) return [];

  const count = randInt(rng, 1, 3);
  return Array.from({ length: count }, (_, i) => {
    const involvedPages = Array.from({ length: randInt(rng, 2, 3) }, () => pick(rng, pages));
    const client = clients.find((c) => c.id === website.clientId)!;
    const head = pick(rng, SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"]);
    const primary = involvedPages[0];

    return {
      id: `${website.id}_cannibal_${i}`,
      websiteId: website.id,
      keyword: head,
      urls: involvedPages.map((p) => ({ url: p.url, rank: randInt(rng, 4, 60), title: p.title })),
      recommendedPrimaryUrl: primary.url,
      recommendation: `Consolidate intent to ${primary.url} and change supporting pages to target long-tail variations instead of "${head}".`,
      severity: pick(rng, ["high", "medium", "low"] as const),
      detectedAt: daysAgo(randInt(rng, 0, 14)),
    };
  });
});
