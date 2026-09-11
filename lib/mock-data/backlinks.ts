import type { Backlink, BacklinkStatus, Client, Keyword, LinkOpportunity, ReferringDomain, Website } from "@/types";
import { chance, daysAgo, pick, pickMany, randInt, rngFor, type Rng } from "./rng";
import { SEO_SERVICE_HEADS_BY_INDUSTRY, slugify } from "./constants";
import { websites, getPagesByWebsite } from "./websites";
import { getClientById } from "./clients";
import { getKeywordsByWebsite } from "./keywords";
import { getCompetitorsByWebsite } from "./competitors";

type Relevance = ReferringDomain["relevance"];
type AnchorKind = "branded" | "exact" | "generic" | "naked";

const STATUS_WEIGHTED: BacklinkStatus[] = [
  "active", "active", "active", "active", "active", "active", "active",
  "new", "new", "new",
  "lost", "lost",
  "suspicious",
];

const LINK_TYPE_WEIGHTED: Backlink["linkType"][] = [
  "dofollow", "dofollow", "dofollow", "dofollow", "dofollow",
  "nofollow", "nofollow", "nofollow",
  "ugc",
  "sponsored",
];

const ANCHOR_KIND_WEIGHTED: AnchorKind[] = ["branded", "branded", "exact", "exact", "exact", "generic", "generic", "naked"];

const RELEVANCE_WEIGHTED: Relevance[] = ["high", "high", "medium", "medium", "medium", "low"];

const GENERIC_ANCHORS = ["click here", "read more", "learn more", "visit site", "find out more", "this page", "official website", "source"];

const REFERRER_TOPIC_SUFFIXES = ["journal", "weekly", "insider", "digest", "report", "network", "today", "guide"] as const;

const GENERIC_DIRECTORY_NAMES = [
  "bizdirectoryhub",
  "localbizfinder",
  "trustedreviews365",
  "theweeklyroundup",
  "markethandbook",
  "consumerchoiceguide",
  "citybiznews",
  "expertpicksdaily",
  "toprateddirectory",
  "businessgazette",
  "reviewnest",
  "directorylistio",
  "thetradejournal",
] as const;

const REFERRER_TLDS = [".com", ".net", ".org", ".io", ".co"] as const;

const SOURCE_PATH_SEGMENTS = ["blog", "articles", "resources", "news", "reviews", "directory", "guides"] as const;
const SOURCE_SLUG_WORDS = ["top-picks", "best-of", "local-guide", "roundup", "spotlight", "overview"] as const;

/** A pool of plausible, mostly-fictional referring domains — some industry-flavored (blogs/journals
 * built off the client's service vocabulary), some generic directory/review-site style. */
function referrerDomainPool(rng: Rng, industry: string, size: number): string[] {
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[industry] ?? ["services"];
  const used = new Set<string>();
  const domains: string[] = [];
  let attempts = 0;
  while (domains.length < size && attempts < size * 12) {
    attempts++;
    const tld = pick(rng, REFERRER_TLDS);
    const base = chance(rng, 0.5)
      ? `${slugify(pick(rng, serviceHeads)).replace(/-/g, "")}${pick(rng, REFERRER_TOPIC_SUFFIXES)}`
      : pick(rng, GENERIC_DIRECTORY_NAMES);
    const domain = `${base}${tld}`;
    if (!used.has(domain)) {
      used.add(domain);
      domains.push(domain);
    }
  }
  return domains;
}

function anchorTextFor(rng: Rng, kind: AnchorKind, website: Website, client: Client, keywords: Keyword[]): string {
  switch (kind) {
    case "branded":
      return chance(rng, 0.5) ? client.name : website.domain;
    case "exact":
      return keywords.length > 0 ? pick(rng, keywords).keyword : client.name;
    case "generic":
      return pick(rng, GENERIC_ANCHORS);
    case "naked":
      return chance(rng, 0.5) ? website.domain : website.url;
  }
}

export const backlinks: Backlink[] = websites.flatMap((website) => {
  const rng = rngFor(`backlinks-${website.id}`);
  const client = getClientById(website.clientId);
  if (!client) return [];
  const pages = getPagesByWebsite(website.id);
  const websiteKeywords = getKeywordsByWebsite(website.id);

  const poolSize = randInt(rng, 10, 20);
  const domainPool = referrerDomainPool(rng, client.industry, poolSize);
  const domainRatings = new Map(domainPool.map((d) => [d, randInt(rng, 8, 92)]));

  const totalBacklinks = randInt(rng, Math.max(15, domainPool.length), 30);

  // Every pool domain gets at least one backlink (so referring-domain aggregation below covers
  // the whole pool), then remaining slots are filled by domains linking again.
  const domainAssignments: string[] = [...domainPool];
  while (domainAssignments.length < totalBacklinks) {
    domainAssignments.push(pick(rng, domainPool));
  }

  return domainAssignments.map((domain, i) => {
    const status = pick(rng, STATUS_WEIGHTED);

    let firstSeenDaysAgo: number;
    let lastSeenDaysAgo: number;
    switch (status) {
      case "new":
        firstSeenDaysAgo = randInt(rng, 0, 13);
        lastSeenDaysAgo = randInt(rng, 0, Math.min(2, firstSeenDaysAgo));
        break;
      case "lost":
        firstSeenDaysAgo = randInt(rng, 45, 420);
        lastSeenDaysAgo = randInt(rng, 5, Math.min(60, firstSeenDaysAgo - 1));
        break;
      case "suspicious":
        firstSeenDaysAgo = randInt(rng, 5, 200);
        lastSeenDaysAgo = randInt(rng, 0, Math.min(4, firstSeenDaysAgo));
        break;
      case "active":
      default:
        firstSeenDaysAgo = randInt(rng, 15, 420);
        lastSeenDaysAgo = randInt(rng, 0, Math.min(5, firstSeenDaysAgo));
        break;
    }

    const anchorKind = pick(rng, ANCHOR_KIND_WEIGHTED);
    const targetPage = pages.length > 0 ? pick(rng, pages) : undefined;
    const targetUrl = targetPage ? targetPage.url : website.url;
    const anchorText = anchorTextFor(rng, anchorKind, website, client, websiteKeywords);
    const path = `/${pick(rng, SOURCE_PATH_SEGMENTS)}/${slugify(pick(rng, SOURCE_SLUG_WORDS))}-${i}`;

    return {
      id: `${website.id}_bl_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      sourceUrl: `https://${domain}${path}`,
      sourceDomain: domain,
      domainRating: domainRatings.get(domain) ?? randInt(rng, 8, 90),
      anchorText,
      targetUrl,
      linkType: pick(rng, LINK_TYPE_WEIGHTED),
      status,
      firstSeenAt: daysAgo(firstSeenDaysAgo),
      lastSeenAt: daysAgo(lastSeenDaysAgo),
    };
  });
});

export function getBacklinksByWebsite(websiteId: string): Backlink[] {
  return backlinks.filter((b) => b.websiteId === websiteId);
}

/** New backlinks: explicitly flagged "new", or simply first seen within the last two weeks. */
export function getNewBacklinks(websiteId: string): Backlink[] {
  const cutoff = new Date(daysAgo(14)).getTime();
  return getBacklinksByWebsite(websiteId).filter(
    (b) => b.status === "new" || new Date(b.firstSeenAt).getTime() >= cutoff,
  );
}

export function getLostBacklinks(websiteId: string): Backlink[] {
  return getBacklinksByWebsite(websiteId).filter((b) => b.status === "lost");
}

// --- Referring domains ---------------------------------------------------------------
// ReferringDomain has no websiteId field, so it's derived directly from `backlinks` (an
// aggregation by source domain) and kept in a per-website map for the getter below.

const referringDomainsByWebsiteId = new Map<string, ReferringDomain[]>(
  websites.map((website) => {
    const rng = rngFor(`referring-domains-${website.id}`);
    const byDomain = new Map<string, Backlink[]>();
    for (const b of getBacklinksByWebsite(website.id)) {
      const list = byDomain.get(b.sourceDomain) ?? [];
      list.push(b);
      byDomain.set(b.sourceDomain, list);
    }

    const domains = Array.from(byDomain.entries()).map(([domain, links], i) => {
      const earliestFirstSeen = links.reduce((min, l) => (l.firstSeenAt < min ? l.firstSeenAt : min), links[0].firstSeenAt);
      const avgRating = Math.round(links.reduce((sum, l) => sum + l.domainRating, 0) / links.length);
      const domainEntry: ReferringDomain = {
        id: `${website.id}_rd_${i.toString().padStart(3, "0")}`,
        domain,
        domainRating: avgRating,
        backlinksCount: links.length,
        isNew: links.some((l) => l.status === "new"),
        relevance: pick(rng, RELEVANCE_WEIGHTED),
        firstSeenAt: earliestFirstSeen,
      };
      return domainEntry;
    });

    return [website.id, domains] as const;
  }),
);

export const referringDomains: ReferringDomain[] = Array.from(referringDomainsByWebsiteId.values()).flat();

export function getReferringDomainsByWebsite(websiteId: string): ReferringDomain[] {
  return referringDomainsByWebsiteId.get(websiteId) ?? [];
}

// --- Link opportunities ---------------------------------------------------------------
// A discovery list for human-led outreach — not an automated link-building/buying tool.

export const linkOpportunities: LinkOpportunity[] = websites.flatMap((website) => {
  const rng = rngFor(`link-opps-${website.id}`);
  const client = getClientById(website.clientId);
  if (!client) return [];
  const comps = getCompetitorsByWebsite(website.id);
  const count = randInt(rng, 5, 10);
  const domainPool = referrerDomainPool(rng, client.industry, count);

  const STATUS_WEIGHTED_FOR_OPPS: LinkOpportunity["status"][] = [
    "identified", "identified", "identified", "identified", "identified",
    "in_outreach", "in_outreach",
    "acquired",
    "declined",
  ];

  return domainPool.map((domain, i) => {
    const linkCompCount = comps.length > 0 ? randInt(rng, 1, Math.min(3, comps.length)) : 0;
    const linksToCompetitorIds = linkCompCount > 0 ? pickMany(rng, comps, linkCompCount).map((c) => c.id) : [];
    const n = linksToCompetitorIds.length;

    const reason =
      n > 0
        ? pick(rng, [
            `Links to ${n} of your competitor${n > 1 ? "s" : ""} but not to you.`,
            `Cited by ${n} competitor site${n > 1 ? "s" : ""} as a trusted reference.`,
            `Already links out to ${n} other business${n > 1 ? "es" : ""} in your space.`,
          ])
        : pick(rng, [
            "Actively links out to industry resources in your niche.",
            "Publishes roundup content that regularly features service providers like you.",
            "High-authority site with an open resources page accepting relevant submissions.",
            "Frequently cites third-party sources in its articles and guides.",
          ]);

    return {
      id: `${website.id}_lo_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      targetDomain: domain,
      domainRating: randInt(rng, 20, 88),
      reason,
      linksToCompetitorIds,
      relevance: pick(rng, RELEVANCE_WEIGHTED),
      status: pick(rng, STATUS_WEIGHTED_FOR_OPPS),
    };
  });
});

export function getLinkOpportunitiesByWebsite(websiteId: string): LinkOpportunity[] {
  return linkOpportunities.filter((o) => o.websiteId === websiteId);
}
