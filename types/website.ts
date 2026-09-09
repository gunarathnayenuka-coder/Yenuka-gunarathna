export type WebsiteStatus = "active" | "crawling" | "paused" | "error";

export interface Website {
  id: string;
  clientId: string;
  domain: string;
  url: string;
  faviconUrl?: string;
  country: string;
  searchEngine: "google" | "bing";
  status: WebsiteStatus;
  seoHealthScore: number;
  pagesIndexed: number;
  pagesCrawled: number;
  trackedKeywords: number;
  organicTraffic: number;
  organicTrafficChangePct: number;
  lastCrawlAt: string;
  nextCrawlAt: string;
  createdAt: string;
}

export type PageIndexStatus = "indexed" | "not_indexed" | "excluded" | "error";

export interface WebsitePage {
  id: string;
  websiteId: string;
  url: string;
  path: string;
  statusCode: number;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1: string;
  h1Count: number;
  wordCount: number;
  canonicalUrl: string;
  isCanonicalSelf: boolean;
  robotsDirective: string;
  indexStatus: PageIndexStatus;
  hasSchema: boolean;
  schemaTypes: string[];
  internalLinksIn: number;
  internalLinksOut: number;
  externalLinks: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  loadTimeMs: number;
  lcpMs: number;
  inpMs: number;
  cls: number;
  seoScore: number;
  isOrphan: boolean;
  crawlDepth: number;
  lastCrawledAt: string;
}

export interface CrawlRun {
  id: string;
  websiteId: string;
  startedAt: string;
  finishedAt?: string;
  status: "queued" | "running" | "completed" | "failed";
  pagesFound: number;
  pagesCrawled: number;
  issuesFound: number;
  trigger: "manual" | "scheduled" | "initial";
}
