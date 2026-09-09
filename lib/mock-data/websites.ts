import type { CrawlRun, PageIndexStatus, Website, WebsitePage } from "@/types";
import { chance, daysAgo, daysFromNow, pick, randFloat, randInt, rngFor } from "./rng";
import { SEO_SERVICE_HEADS_BY_INDUSTRY, domainFor, slugify } from "./constants";
import { clients } from "./clients";

const PAGE_PATH_TEMPLATES = [
  "/",
  "/about",
  "/services",
  "/services/{service}",
  "/contact",
  "/blog",
  "/blog/{slug}",
  "/blog/{slug}",
  "/blog/{slug}",
  "/pricing",
  "/locations/{city}",
  "/faq",
  "/testimonials",
  "/careers",
];

export const websites: Website[] = clients.flatMap((client) =>
  client.websiteIds.map((websiteId, i) => {
    const rng = rngFor(`website-${websiteId}`);
    const base = domainFor(client.name);
    const domain = i === 0 ? base : base.replace(".com", `-shop.com`);
    const lastCrawlDaysAgo = randInt(rng, 0, 2);
    return {
      id: websiteId,
      clientId: client.id,
      domain,
      url: `https://${domain}`,
      country: client.country,
      searchEngine: "google" as const,
      status: chance(rng, 0.9) ? "active" : "crawling",
      seoHealthScore: randInt(rng, 55, 97),
      pagesIndexed: randInt(rng, 40, 260),
      pagesCrawled: randInt(rng, 45, 280),
      trackedKeywords: randInt(rng, 30, 260),
      organicTraffic: randInt(rng, 800, 40000),
      organicTrafficChangePct: randFloat(rng, -20, 45, 1),
      lastCrawlAt: daysAgo(lastCrawlDaysAgo),
      nextCrawlAt: daysFromNow(1 - lastCrawlDaysAgo),
      createdAt: client.createdAt,
    };
  }),
);

export function getWebsiteById(id: string): Website | undefined {
  return websites.find((w) => w.id === id);
}

export function getWebsitesByClient(clientId: string): Website[] {
  return websites.filter((w) => w.clientId === clientId);
}

export interface TrafficHistoryPoint {
  date: string;
  organicTraffic: number;
}

export function getTrafficHistory(websiteId: string): TrafficHistoryPoint[] {
  const rng = rngFor(`traffic-history-${websiteId}`);
  const website = websites.find((w) => w.id === websiteId);
  const target = website?.organicTraffic ?? 5000;
  const startFactor = 1 - (website?.organicTrafficChangePct ?? 0) / 100;
  let value = Math.max(100, Math.round(target * startFactor));

  return Array.from({ length: 12 }, (_, i) => {
    const isLast = i === 11;
    if (!isLast) {
      const drift = (target - value) / (12 - i);
      value = Math.max(50, Math.round(value + drift + randInt(rng, -Math.round(target * 0.04), Math.round(target * 0.04))));
    } else {
      value = target;
    }
    return { date: daysAgo((11 - i) * 7), organicTraffic: value };
  });
}

const INDEX_STATUS_WEIGHTS: PageIndexStatus[] = [
  "indexed",
  "indexed",
  "indexed",
  "indexed",
  "not_indexed",
  "excluded",
];

export const websitePages: WebsitePage[] = websites.flatMap((website) => {
  const rng = rngFor(`pages-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const serviceHeads = SEO_SERVICE_HEADS_BY_INDUSTRY[client.industry] ?? ["services"];
  const pageCount = randInt(rng, 16, 30);

  return Array.from({ length: pageCount }, (_, i) => {
    const template = pick(rng, PAGE_PATH_TEMPLATES);
    const service = pick(rng, serviceHeads);
    const path =
      i === 0
        ? "/"
        : template
            .replace("{service}", slugify(service))
            .replace("{slug}", slugify(`${service}-${pick(rng, ["guide", "tips", "checklist", "faq", "cost"])}-${i}`))
            .replace("{city}", slugify(client.address?.city ?? "colombo"));
    const titleLength = randInt(rng, 28, 78);
    const metaLength = randInt(rng, 0, 172);
    const wordCount = randInt(rng, 180, 2400);
    const imagesTotal = randInt(rng, 0, 14);
    const imagesMissingAlt = chance(rng, 0.3) ? randInt(rng, 1, Math.min(4, imagesTotal || 1)) : 0;

    return {
      id: `${website.id}_page_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      url: `${website.url}${path}`,
      path,
      statusCode: chance(rng, 0.95) ? 200 : pick(rng, [301, 404, 500]),
      title: `${service.charAt(0).toUpperCase()}${service.slice(1)} | ${client.name}`,
      titleLength,
      metaDescription:
        metaLength === 0
          ? ""
          : `Learn more about our ${service} and how ${client.name} can help you get results.`,
      metaDescriptionLength: metaLength,
      h1: path === "/" ? client.name : `${service.charAt(0).toUpperCase()}${service.slice(1)}`,
      h1Count: chance(rng, 0.12) ? randInt(rng, 0, 2) : 1,
      wordCount,
      canonicalUrl: `${website.url}${path}`,
      isCanonicalSelf: chance(rng, 0.92),
      robotsDirective: chance(rng, 0.05) ? "noindex, follow" : "index, follow",
      indexStatus: pick(rng, INDEX_STATUS_WEIGHTS),
      hasSchema: chance(rng, 0.55),
      schemaTypes: chance(rng, 0.55) ? pick(rng, [["Organization"], ["LocalBusiness"], ["Article"], ["FAQPage", "BreadcrumbList"]]) : [],
      internalLinksIn: randInt(rng, 0, 24),
      internalLinksOut: randInt(rng, 1, 18),
      externalLinks: randInt(rng, 0, 6),
      imagesTotal,
      imagesMissingAlt,
      loadTimeMs: randInt(rng, 380, 4200),
      lcpMs: randInt(rng, 1200, 5400),
      inpMs: randInt(rng, 80, 620),
      cls: randFloat(rng, 0, 0.42, 2),
      seoScore: randInt(rng, 38, 98),
      isOrphan: chance(rng, 0.08),
      crawlDepth: randInt(rng, 0, 5),
      lastCrawledAt: website.lastCrawlAt,
    };
  });
});

export function getPagesByWebsite(websiteId: string): WebsitePage[] {
  return websitePages.filter((p) => p.websiteId === websiteId);
}

export const crawlRuns: CrawlRun[] = websites.flatMap((website) => {
  const rng = rngFor(`crawls-${website.id}`);
  return Array.from({ length: 6 }, (_, i) => {
    const startedDaysAgo = i * 7 + randInt(rng, 0, 1);
    return {
      id: `${website.id}_crawl_${i}`,
      websiteId: website.id,
      startedAt: daysAgo(startedDaysAgo),
      finishedAt: daysAgo(startedDaysAgo - 0.02),
      status: "completed" as const,
      pagesFound: randInt(rng, 40, 280),
      pagesCrawled: randInt(rng, 40, 280),
      issuesFound: randInt(rng, 2, 40),
      trigger: i === 5 ? ("initial" as const) : ("scheduled" as const),
    };
  });
});
