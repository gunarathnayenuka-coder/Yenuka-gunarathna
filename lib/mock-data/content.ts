import type {
  Client,
  ContentAuditFinding,
  ContentBrief,
  ContentItem,
  ContentStatus,
  ContentType,
  SearchIntent,
  TopicCluster,
  WebsitePage,
} from "@/types";
import { SEARCH_INTENTS } from "@/types";
import { chance, daysAgo, daysFromNow, pick, pickMany, randInt, rngFor, type Rng } from "./rng";
import {
  COMPETITOR_DOMAIN_SUFFIXES,
  CONTENT_TITLE_TEMPLATES,
  SEO_SERVICE_HEADS_BY_INDUSTRY,
  SEO_TOPIC_MODIFIERS,
  slugify,
} from "./constants";
import { getPagesByWebsite, websites } from "./websites";
import { clients } from "./clients";
import { getKeywordsByWebsite } from "./keywords";
import { users } from "./organizations";

const CONTENT_TYPES: ContentType[] = ["blog_post", "landing_page", "product_page", "guide", "case_study"];

const CONTENT_STATUS_ORDER: ContentStatus[] = ["idea", "brief", "draft", "review", "approved", "published", "needs_update"];

/** Weighted so generated content skews toward "published" and "draft", per the product spec. */
const CONTENT_STATUS_WEIGHTED: ContentStatus[] = [
  "idea",
  "idea",
  "brief",
  "brief",
  "draft",
  "draft",
  "draft",
  "draft",
  "review",
  "review",
  "approved",
  "published",
  "published",
  "published",
  "published",
  "published",
  "published",
  "needs_update",
  "needs_update",
];

const TONES = ["Professional", "Friendly", "Authoritative", "Conversational"] as const;

const SUBTOPIC_TEMPLATES = [
  "What is {topic}?",
  "Key benefits of {topic}",
  "How much does {topic} cost?",
  "{topic} vs the alternatives",
  "Common mistakes to avoid with {topic}",
  "How to choose the right {topic} provider",
  "{topic} maintenance and upkeep tips",
  "Frequently asked questions about {topic}",
];

const QUESTION_TEMPLATES = [
  "What does {topic} typically cost?",
  "How long does {topic} take?",
  "Is {topic} worth the investment?",
  "What should I look for in a {topic} provider?",
  "How do I choose the best {topic} near me?",
  "What are the risks of skipping {topic}?",
  "How often should {topic} be done?",
];

interface AuditTemplate {
  issue: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

const CONTENT_AUDIT_TEMPLATES: AuditTemplate[] = [
  {
    issue: "Thin content",
    detail: "This page has significantly fewer words than top-ranking competitors targeting the same keyword.",
    severity: "medium",
  },
  {
    issue: "Outdated statistics",
    detail: "Data and figures referenced in this content are more than a year old and may no longer be accurate.",
    severity: "medium",
  },
  {
    issue: "Missing internal links",
    detail: "This page has very few internal links pointing to or from other relevant content on the site.",
    severity: "low",
  },
  {
    issue: "Keyword not in H1",
    detail: "The primary target keyword does not appear in the page's H1 heading.",
    severity: "high",
  },
  {
    issue: "Missing meta description",
    detail: "This page has no meta description, so search engines will auto-generate a snippet from body text.",
    severity: "medium",
  },
  {
    issue: "Duplicate content risk",
    detail: "Large sections of this content closely resemble another page on the site, risking cannibalization.",
    severity: "high",
  },
  {
    issue: "Weak call to action",
    detail: "The page does not clearly guide readers toward a next step, reducing conversion potential.",
    severity: "low",
  },
  {
    issue: "Keyword cannibalization risk",
    detail: "Another page on the site targets a very similar keyword, which may split ranking signals.",
    severity: "medium",
  },
  {
    issue: "Missing structured data",
    detail: "This content type qualifies for Article or FAQ schema, but none is currently implemented.",
    severity: "low",
  },
  {
    issue: "Declining organic traffic",
    detail: "Traffic to this page has trended down over the last few months, suggesting it needs a refresh.",
    severity: "high",
  },
];

function capitalizeWords(input: string): string {
  return input.replace(/\b\w/g, (c) => c.toUpperCase());
}

function intentForType(rng: Rng, type: ContentType): SearchIntent {
  if (type === "blog_post" || type === "guide") {
    return chance(rng, 0.7) ? "informational" : pick(rng, SEARCH_INTENTS);
  }
  if (type === "landing_page" || type === "product_page") {
    return chance(rng, 0.65) ? "transactional" : pick(rng, SEARCH_INTENTS);
  }
  return chance(rng, 0.55) ? "commercial" : pick(rng, SEARCH_INTENTS);
}

function randomModifierPhrase(rng: Rng, head: string, city: string): string {
  const modifier = pick(rng, SEO_TOPIC_MODIFIERS);
  return `${head} ${modifier.replace("{city}", city)}`.trim();
}

function titleFor(rng: Rng, type: ContentType, topic: string, clientName: string, city: string): string {
  const cap = capitalizeWords(topic);
  if (type === "landing_page" || type === "product_page") {
    return chance(rng, 0.5) ? `${cap} in ${city} | ${clientName}` : `${cap} | ${clientName}`;
  }
  const template = pick(rng, CONTENT_TITLE_TEMPLATES);
  return template.replace("{topic}", cap);
}

function targetUrlFor(
  rng: Rng,
  status: ContentStatus,
  type: ContentType,
  websiteUrl: string,
  pages: WebsitePage[],
  topic: string,
): string {
  const isLive = status === "published" || status === "needs_update";
  if (isLive && pages.length > 0 && chance(rng, 0.75)) {
    return pick(rng, pages).url;
  }
  const base =
    type === "landing_page" ? "" : type === "product_page" ? "services" : type === "case_study" ? "case-studies" : "blog";
  const slug = slugify(topic);
  return base ? `${websiteUrl}/${base}/${slug}` : `${websiteUrl}/${slug}`;
}

function seoScoreFor(rng: Rng, status: ContentStatus): number | null {
  switch (status) {
    case "idea":
    case "brief":
      return null;
    case "draft":
      return randInt(rng, 35, 70);
    case "review":
      return randInt(rng, 50, 80);
    case "approved":
      return randInt(rng, 65, 90);
    case "published":
      return randInt(rng, 60, 98);
    case "needs_update":
      return randInt(rng, 32, 64);
  }
}

/**
 * Assigns one status per item, guaranteeing every ContentStatus appears at least once
 * (a pure weighted pick over only 10-18 draws can easily miss a low-weight status like
 * "approved" by chance) while keeping the overall weighting toward published/draft.
 */
function statusesFor(rng: Rng, count: number): ContentStatus[] {
  const statuses: ContentStatus[] = [...CONTENT_STATUS_ORDER];
  for (let i = statuses.length; i < count; i++) {
    statuses.push(pick(rng, CONTENT_STATUS_WEIGHTED));
  }
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i);
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }
  return statuses;
}

function wordCountFor(rng: Rng, status: ContentStatus): number {
  switch (status) {
    case "idea":
      return 0;
    case "brief":
      return randInt(rng, 0, 180);
    case "draft":
      return randInt(rng, 300, 1400);
    case "review":
      return randInt(rng, 600, 1800);
    case "approved":
      return randInt(rng, 800, 2200);
    case "published":
      return randInt(rng, 900, 3200);
    case "needs_update":
      return randInt(rng, 500, 2000);
  }
}

export const contentItems: ContentItem[] = websites.flatMap((website) => {
  const rng = rngFor(`content-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"];
  const city = client.address?.city ?? "Colombo";
  const websiteKeywords = getKeywordsByWebsite(website.id);
  const pages = getPagesByWebsite(website.id);
  const contentWriters = users.filter((u) => u.role === "content_writer");
  const count = randInt(rng, 10, 18);
  const usedTitles = new Set<string>();
  const statuses = statusesFor(rng, count);

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i];
    const type = pick(rng, CONTENT_TYPES);
    const fallbackIntent = intentForType(rng, type);

    const head = pick(rng, serviceHeads);
    const useRealKeyword = websiteKeywords.length > 0 && chance(rng, 0.65);
    const keywordRecord = useRealKeyword ? pick(rng, websiteKeywords) : undefined;
    const primaryKeyword = keywordRecord ? keywordRecord.keyword : randomModifierPhrase(rng, head, city);
    const searchIntent = keywordRecord ? keywordRecord.intent : fallbackIntent;

    const secondaryPool = websiteKeywords.filter((k) => k.keyword !== primaryKeyword).map((k) => k.keyword);
    const secondaryKeywords =
      secondaryPool.length >= 2
        ? pickMany(rng, secondaryPool, randInt(rng, 1, Math.min(4, secondaryPool.length)))
        : Array.from({ length: randInt(rng, 1, 3) }, () => randomModifierPhrase(rng, pick(rng, serviceHeads), city));

    let title = titleFor(rng, type, primaryKeyword, client.name, city);
    let attempts = 0;
    while (usedTitles.has(title) && attempts < 5) {
      title = titleFor(rng, type, randomModifierPhrase(rng, head, city), client.name, city);
      attempts++;
    }
    usedTitles.add(title);

    const authorId = contentWriters.length > 0 && chance(rng, 0.7) ? pick(rng, contentWriters).id : pick(rng, users).id;

    const isLive = status === "published" || status === "needs_update";
    const publishedDaysAgo = isLive ? randInt(rng, 5, 210) : undefined;
    const updatedDaysAgo = isLive ? randInt(rng, 0, publishedDaysAgo!) : randInt(rng, 0, 21);
    const wantsDueDate =
      (status === "idea" || status === "brief" || status === "draft" || status === "review") && chance(rng, 0.65);

    const item: ContentItem = {
      id: `${website.id}_content_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      title,
      primaryKeyword,
      secondaryKeywords,
      searchIntent,
      status,
      type,
      authorId,
      targetUrl: targetUrlFor(rng, status, type, website.url, pages, primaryKeyword),
      seoScore: seoScoreFor(rng, status),
      wordCount: wordCountFor(rng, status),
      updatedAt: daysAgo(updatedDaysAgo),
    };
    if (wantsDueDate) item.dueDate = daysFromNow(randInt(rng, 3, 45));
    if (isLive) item.publishedAt = daysAgo(publishedDaysAgo!);
    return item;
  });
});

function pillarUrlFor(rng: Rng, websiteUrl: string, pages: WebsitePage[], head: string): string {
  if (pages.length > 0 && chance(rng, 0.4)) return pick(rng, pages).url;
  return `${websiteUrl}/services/${slugify(head)}`;
}

export const topicClusters: TopicCluster[] = websites.flatMap((website) => {
  const rng = rngFor(`clusters-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"];
  const pages = getPagesByWebsite(website.id);
  const websiteKeywords = getKeywordsByWebsite(website.id);
  const websiteContentIds = contentItems.filter((c) => c.websiteId === website.id).map((c) => c.id);

  const clusterCount = Math.min(serviceHeads.length, randInt(rng, 3, 5));
  const heads = pickMany(rng, serviceHeads, clusterCount);

  const clusters = heads.map((head, i) => {
    const relatedKeywords = websiteKeywords.filter((k) => k.keyword.includes(head));
    const totalVolume =
      relatedKeywords.length > 0 ? relatedKeywords.reduce((sum, k) => sum + k.volume, 0) : randInt(rng, 800, 22000);
    const coverageScore = randInt(rng, 15, 95);
    const status: TopicCluster["status"] = coverageScore >= 70 ? "strong" : coverageScore >= 40 ? "developing" : "weak";
    const supportingContentIds =
      websiteContentIds.length > 0
        ? pickMany(rng, websiteContentIds, Math.min(websiteContentIds.length, randInt(rng, 2, 6)))
        : [];

    return {
      id: `${website.id}_cluster_${i.toString().padStart(2, "0")}`,
      websiteId: website.id,
      name: capitalizeWords(head),
      pillarUrl: pillarUrlFor(rng, website.url, pages, head),
      supportingContentIds,
      totalVolume,
      coverageScore,
      status,
    } satisfies TopicCluster;
  });

  // Guarantee at least one visibly "weak" cluster per website so the actionable
  // signal ("which cluster needs attention") is always present in the demo data.
  if (clusters.length > 0 && !clusters.some((c) => c.status === "weak")) {
    const weakest = clusters.reduce((min, c) => (c.coverageScore < min.coverageScore ? c : min), clusters[0]);
    weakest.coverageScore = randInt(rng, 15, 38);
    weakest.status = "weak";
  }

  return clusters;
});

// Backfill ContentItem.clusterId from the clusters that list it as supporting content.
const clusterIdByContentId = new Map<string, string>();
for (const cluster of topicClusters) {
  for (const contentId of cluster.supportingContentIds) {
    if (!clusterIdByContentId.has(contentId)) clusterIdByContentId.set(contentId, cluster.id);
  }
}
for (const item of contentItems) {
  const clusterId = clusterIdByContentId.get(item.id);
  if (clusterId) item.clusterId = clusterId;
}

function buildBrief(rng: Rng, item: ContentItem, client: Client, pages: WebsitePage[]): ContentBrief {
  const topic = item.primaryKeyword;
  const capTopic = capitalizeWords(topic);
  const subtopics = pickMany(rng, SUBTOPIC_TEMPLATES, randInt(rng, 3, 6)).map((t) => t.replaceAll("{topic}", capTopic));
  const questionsToAnswer = pickMany(rng, QUESTION_TEMPLATES, randInt(rng, 3, 6)).map((t) => t.replaceAll("{topic}", topic));
  const internalLinkSuggestions =
    pages.length > 0 ? pickMany(rng, pages, Math.min(pages.length, randInt(rng, 3, 6))).map((p) => p.url) : [client.name];
  const competitorUrls = pickMany(
    rng,
    COMPETITOR_DOMAIN_SUFFIXES,
    Math.min(COMPETITOR_DOMAIN_SUFFIXES.length, randInt(rng, 2, 4)),
  ).map((suffix) => `https://${slugify(topic).replace(/-/g, "")}${suffix}.com`);
  const city = client.address?.city;

  return {
    id: `${item.id}_brief`,
    contentItemId: item.id,
    targetKeyword: item.primaryKeyword,
    secondaryKeywords: item.secondaryKeywords,
    searchIntent: item.searchIntent,
    suggestedTitle: titleFor(rng, item.type, topic, client.name, city ?? "Colombo"),
    suggestedMetaDescription: `Discover everything you need to know about ${topic} — practical advice, costs, and expert tips${city ? ` for readers in ${city}` : ""}. Updated for 2026.`,
    targetWordCount: Math.max(600, item.wordCount || randInt(rng, 900, 2200)),
    subtopics,
    questionsToAnswer,
    competitorUrls,
    internalLinkSuggestions,
    tone: pick(rng, TONES),
    audience: client.targetAudience ?? `${client.industry} customers in ${city ?? "the region"}`,
  };
}

export const contentBriefs: ContentBrief[] = websites.flatMap((website) => {
  const rng = rngFor(`briefs-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const pages = getPagesByWebsite(website.id);
  const websiteContent = contentItems.filter((c) => c.websiteId === website.id);

  return websiteContent
    .filter((item) => (item.status === "brief" || item.status === "draft" ? chance(rng, 0.85) : chance(rng, 0.35)))
    .map((item) => buildBrief(rng, item, client, pages));
});

export const contentAuditFindings: ContentAuditFinding[] = websites.flatMap((website) => {
  const rng = rngFor(`content-audit-${website.id}`);
  const websiteContent = contentItems.filter(
    (c) => c.websiteId === website.id && (c.status === "published" || c.status === "needs_update"),
  );
  if (websiteContent.length === 0) return [];

  const count = randInt(rng, 3, 7);
  return Array.from({ length: count }, (_, i) => {
    const item = pick(rng, websiteContent);
    const template = pick(rng, CONTENT_AUDIT_TEMPLATES);
    return {
      id: `${website.id}_content_finding_${i.toString().padStart(2, "0")}`,
      contentItemId: item.id,
      url: item.targetUrl,
      issue: template.issue,
      detail: template.detail,
      severity: template.severity,
    } satisfies ContentAuditFinding;
  });
});

export function getContentByWebsite(websiteId: string): ContentItem[] {
  return contentItems.filter((c) => c.websiteId === websiteId);
}

export function getContentItemById(id: string): ContentItem | undefined {
  return contentItems.find((c) => c.id === id);
}

export function getContentBriefsByWebsite(websiteId: string): ContentBrief[] {
  const ids = new Set(getContentByWebsite(websiteId).map((c) => c.id));
  return contentBriefs.filter((b) => ids.has(b.contentItemId));
}

export function getContentBriefByContentItemId(contentItemId: string): ContentBrief | undefined {
  return contentBriefs.find((b) => b.contentItemId === contentItemId);
}

export function getContentAuditFindingsByWebsite(websiteId: string): ContentAuditFinding[] {
  const ids = new Set(getContentByWebsite(websiteId).map((c) => c.id));
  return contentAuditFindings.filter((f) => ids.has(f.contentItemId));
}

export function getTopicClustersByWebsite(websiteId: string): TopicCluster[] {
  return topicClusters.filter((t) => t.websiteId === websiteId);
}
