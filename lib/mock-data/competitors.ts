import type { Competitor, CompetitorContentGap, CompetitorKeywordGap, CompetitorPage } from "@/types";
import { chance, pick, pickMany, randFloat, randInt, rngFor, daysAgo, type Rng } from "./rng";
import { COMPETITOR_DOMAIN_SUFFIXES, CONTENT_TITLE_TEMPLATES, SEO_SERVICE_HEADS_BY_INDUSTRY, SEO_TOPIC_MODIFIERS, slugify } from "./constants";
import { websites } from "./websites";
import { getClientById } from "./clients";
import { getKeywordsByWebsite } from "./keywords";
import type { Client, Website } from "@/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Plausible, industry-flavored competitor domains — a mix of "brand-style" names built off the
 * client's own name and generic service-flavored names, so competitor lists don't all look alike. */
function competitorDomains(rng: Rng, client: Client, count: number): string[] {
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"];
  const used = new Set<string>();
  const domains: string[] = [];
  let attempts = 0;
  while (domains.length < count && attempts < count * 12) {
    attempts++;
    const suffix = pick(rng, COMPETITOR_DOMAIN_SUFFIXES);
    const base = chance(rng, 0.35)
      ? slugify(client.name).replace(/-/g, "")
      : slugify(pick(rng, serviceHeads)).replace(/-/g, "");
    const domain = `${base}${suffix}.com`;
    if (!used.has(domain)) {
      used.add(domain);
      domains.push(domain);
    }
  }
  return domains;
}

/** Splits an organic-keyword footprint into nested top3/top10/top20 buckets (each a subset of the next). */
function rankBuckets(rng: Rng, organicKeywords: number): { top3: number; top10: number; top20: number } {
  const top20 = Math.round(organicKeywords * randFloat(rng, 0.12, 0.3, 3));
  const top10 = Math.round(top20 * randFloat(rng, 0.45, 0.7, 3));
  const top3 = Math.round(top10 * randFloat(rng, 0.15, 0.35, 3));
  return { top3, top10, top20 };
}

export const competitors: Competitor[] = websites.flatMap((website) => {
  const rng = rngFor(`competitors-${website.id}`);
  const client = getClientById(website.clientId);
  if (!client) return [];

  const count = randInt(rng, 3, 4);
  const domains = competitorDomains(rng, client, count);

  return domains.map((domain, i) => {
    // Relative "strength" vs. this website — skews toward competitors doing somewhat better
    // (why they're worth tracking) but with enough spread that it isn't mechanical.
    const strength = randFloat(rng, 0.55, 1.75, 2);
    const organicKeywords = Math.max(20, Math.round(website.trackedKeywords * strength * randFloat(rng, 0.8, 1.25, 2)));
    const { top3, top10, top20 } = rankBuckets(rng, organicKeywords);
    const estMonthlyTraffic = Math.max(150, Math.round(website.organicTraffic * strength * randFloat(rng, 0.75, 1.35, 2)));
    const contentPages = Math.max(8, Math.round(organicKeywords * randFloat(rng, 0.15, 0.4, 2)));
    const referringDomains = Math.max(3, Math.round((estMonthlyTraffic / 250) * randFloat(rng, 0.4, 1.1, 2)));
    const technicalScore = clamp(website.seoHealthScore + (strength - 1) * 18 + randInt(rng, -8, 8), 28, 99);

    return {
      id: `${website.id}_comp_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      domain,
      organicKeywords,
      top3Keywords: top3,
      top10Keywords: top10,
      top20Keywords: top20,
      estMonthlyTraffic,
      contentPages,
      referringDomains,
      technicalScore,
      addedAt: daysAgo(randInt(rng, 20, 380)),
    };
  });
});

export function getCompetitorsByWebsite(websiteId: string): Competitor[] {
  return competitors.filter((c) => c.websiteId === websiteId);
}

export function getCompetitorById(id: string): Competitor | undefined {
  return competitors.find((c) => c.id === id);
}

// --- Keyword gaps -----------------------------------------------------------------
// CompetitorKeywordGap has no websiteId field of its own, so association with a website
// is tracked internally via this map rather than by filtering a flat array.

function buildKeywordGapsForWebsite(website: Website): CompetitorKeywordGap[] {
  const rng = rngFor(`kw-gaps-${website.id}`);
  const websiteKeywords = getKeywordsByWebsite(website.id);
  const comps = getCompetitorsByWebsite(website.id);
  if (comps.length === 0 || websiteKeywords.length === 0) return [];

  // Prefer keywords we don't rank for at all, or rank poorly on — that's the actionable gap.
  const poorlyRanked = websiteKeywords.filter((k) => k.currentRank === null || k.currentRank > 15);
  const pool = poorlyRanked.length >= 4 ? poorlyRanked : websiteKeywords;
  const count = Math.min(pool.length, randInt(rng, 6, 12));
  const selected = pickMany(rng, pool, count);

  return selected.map((k, i) => {
    const gapCompCount = randInt(rng, 1, Math.min(3, comps.length));
    const gapComps = pickMany(rng, comps, gapCompCount);
    const ourRank = k.currentRank;

    const competitorRanks = gapComps.map((c) => {
      const rank = ourRank === null ? randInt(rng, 1, 30) : randInt(rng, 1, Math.max(1, ourRank - 1));
      return { competitorId: c.id, rank };
    });

    const bestCompetitorRank = Math.min(...competitorRanks.map((r) => r.rank));
    const gapSize = ourRank === null ? 25 : Math.min(25, ourRank - bestCompetitorRank);
    const opportunityScore = clamp(
      (Math.log10(k.volume + 1) / 4.2) * 35 + (100 - k.difficulty) * 0.25 + gapSize,
      0,
      100,
    );

    return {
      id: `${website.id}_kwgap_${i.toString().padStart(3, "0")}`,
      keyword: k.keyword,
      volume: k.volume,
      difficulty: k.difficulty,
      ourRank,
      competitorRanks,
      opportunityScore,
    };
  });
}

const keywordGapsByWebsiteId = new Map<string, CompetitorKeywordGap[]>(
  websites.map((website) => [website.id, buildKeywordGapsForWebsite(website)] as const),
);

export const competitorKeywordGaps: CompetitorKeywordGap[] = Array.from(keywordGapsByWebsiteId.values()).flat();

/** Sorted by opportunityScore desc — the highest-impact gaps first. */
export function getKeywordGapsByWebsite(websiteId: string): CompetitorKeywordGap[] {
  const gaps = keywordGapsByWebsiteId.get(websiteId) ?? [];
  return [...gaps].sort((a, b) => b.opportunityScore - a.opportunityScore);
}

// --- Content gaps -------------------------------------------------------------------
// CompetitorContentGap also has no websiteId field — same map-based association.

function buildContentGapsForWebsite(website: Website): CompetitorContentGap[] {
  const rng = rngFor(`content-gaps-${website.id}`);
  const client = getClientById(website.clientId);
  const comps = getCompetitorsByWebsite(website.id);
  if (!client || comps.length === 0) return [];

  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"];
  const city = client.address?.city ?? "Colombo";
  const count = randInt(rng, 5, 10);

  return Array.from({ length: count }, (_, i) => {
    const head = pick(rng, serviceHeads);
    const headTitleCase = head.charAt(0).toUpperCase() + head.slice(1);
    const topic = pick(rng, CONTENT_TITLE_TEMPLATES).replace("{topic}", headTitleCase);
    const competitor = pick(rng, comps);
    const slugSuffix = pick(rng, ["guide", "checklist", "comparison", "overview", "tips", "faq"]);
    const targetKeywordCount = randInt(rng, 2, 4);
    const modifiers = pickMany(rng, SEO_TOPIC_MODIFIERS, targetKeywordCount);
    const targetKeywords = modifiers.map((m) => `${head} ${m.replace("{city}", city)}`.trim());

    return {
      id: `${website.id}_cgap_${i.toString().padStart(3, "0")}`,
      topic,
      competitorUrl: `https://${competitor.domain}/blog/${slugify(`${head}-${slugSuffix}`)}`,
      competitorDomain: competitor.domain,
      estTraffic: randInt(rng, 150, 6000),
      targetKeywords,
      weCoverTopic: chance(rng, 0.18),
    };
  });
}

const contentGapsByWebsiteId = new Map<string, CompetitorContentGap[]>(
  websites.map((website) => [website.id, buildContentGapsForWebsite(website)] as const),
);

export const competitorContentGaps: CompetitorContentGap[] = Array.from(contentGapsByWebsiteId.values()).flat();

export function getContentGapsByWebsite(websiteId: string): CompetitorContentGap[] {
  return contentGapsByWebsiteId.get(websiteId) ?? [];
}

// --- Competitor pages -----------------------------------------------------------------

const PAGE_TITLE_TEMPLATES = [
  "The Complete Guide to {topic}",
  "{topic}: What You Need to Know",
  "How Much Does {topic} Cost in 2026?",
  "Top Tips for {topic}",
  "{topic} — Frequently Asked Questions",
];

export const competitorPages: CompetitorPage[] = competitors.flatMap((competitor) => {
  const rng = rngFor(`competitor-pages-${competitor.id}`);
  const website = websites.find((w) => w.id === competitor.websiteId);
  const client = website ? getClientById(website.clientId) : undefined;
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client?.industry ?? ""] ?? ["services"];
  const count = randInt(rng, 3, 6);

  return Array.from({ length: count }, (_, i) => {
    const head = pick(rng, serviceHeads);
    const headTitleCase = head.charAt(0).toUpperCase() + head.slice(1);
    const title = pick(rng, PAGE_TITLE_TEMPLATES).replace("{topic}", headTitleCase);
    const modifier = pick(rng, SEO_TOPIC_MODIFIERS).replace("{city}", client?.address?.city ?? "Colombo");

    return {
      id: `${competitor.id}_page_${i.toString().padStart(3, "0")}`,
      competitorId: competitor.id,
      url: `https://${competitor.domain}/blog/${slugify(`${head}-${i}`)}`,
      title,
      estTraffic: randInt(rng, 80, 4500),
      topKeyword: `${head} ${modifier}`.trim(),
      publishedAt: daysAgo(randInt(rng, 10, 500)),
    };
  });
});

export function getCompetitorPagesByCompetitor(competitorId: string): CompetitorPage[] {
  return competitorPages.filter((p) => p.competitorId === competitorId);
}
