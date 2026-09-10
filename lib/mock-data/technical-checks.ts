import type { TechnicalCheck, TechnicalCheckStatus, WebsitePage } from "@/types";
import { getPagesByWebsite } from "./websites";
import { chance, randInt, rngFor } from "./rng";
import type { Rng } from "./rng";

interface CheckDefinition {
  slug: string;
  label: string;
  description: string;
  category: TechnicalCheck["category"];
  evaluate: (pages: WebsitePage[], rng: Rng) => { status: TechnicalCheckStatus; affectedUrls: number };
}

/** Any affected URLs at all is at least a warning; `failAt` escalates it to a failure. */
function statusFor(affectedUrls: number, failAt: number): TechnicalCheckStatus {
  if (affectedUrls <= 0) return "pass";
  if (affectedUrls >= failAt) return "fail";
  return "warning";
}

const CHECK_DEFINITIONS: CheckDefinition[] = [
  {
    slug: "https",
    label: "HTTPS Enforcement",
    description: "All pages should be served securely over HTTPS with no mixed-content resources.",
    category: "indexability",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => !p.url.startsWith("https://")).length;
      return { status: statusFor(affectedUrls, 3), affectedUrls };
    },
  },
  {
    slug: "indexability",
    label: "Indexability (Meta Robots)",
    description: "Pages that matter for organic search should not be excluded with a noindex directive.",
    category: "indexability",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.robotsDirective.includes("noindex")).length;
      return { status: statusFor(affectedUrls, 4), affectedUrls };
    },
  },
  {
    slug: "xml-sitemap",
    label: "XML Sitemap",
    description: "The sitemap should list only indexable, 200-status URLs and stay free of orphaned pages.",
    category: "sitemap_robots",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.statusCode !== 200 || p.isOrphan).length;
      return { status: statusFor(affectedUrls, 4), affectedUrls };
    },
  },
  {
    slug: "robots-txt",
    label: "Robots.txt",
    description: "Robots.txt should allow crawling of the CSS/JS assets required to render the page and avoid disallowing important sections.",
    category: "sitemap_robots",
    evaluate: (_pages, rng) => {
      const roll = rng();
      if (roll < 0.78) return { status: "pass", affectedUrls: 0 };
      if (roll < 0.94) return { status: "warning", affectedUrls: randInt(rng, 1, 4) };
      return { status: "fail", affectedUrls: randInt(rng, 3, 9) };
    },
  },
  {
    slug: "canonical",
    label: "Canonical Tags",
    description: "Pages should carry a self-referencing canonical unless they intentionally point to a preferred duplicate.",
    category: "duplicate_content",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => !p.isCanonicalSelf).length;
      return { status: statusFor(affectedUrls, Math.max(4, Math.ceil(pages.length * 0.2))), affectedUrls };
    },
  },
  {
    slug: "status-codes",
    label: "HTTP Status Codes",
    description: "Crawled URLs should resolve with a 200 status; client and server errors waste crawl budget and break the user journey.",
    category: "crawlability",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.statusCode >= 400).length;
      return { status: statusFor(affectedUrls, 2), affectedUrls };
    },
  },
  {
    slug: "redirects",
    label: "Redirects",
    description: "Internal links should point directly at their final destination instead of routing through a redirect.",
    category: "redirects",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.statusCode >= 300 && p.statusCode < 400).length;
      return { status: statusFor(affectedUrls, 3), affectedUrls };
    },
  },
  {
    slug: "broken-links",
    label: "Broken Internal Links",
    description: "Internal links should never point at a page that returns a 404, which wastes crawl budget and hurts UX.",
    category: "crawlability",
    evaluate: (pages) => {
      const affectedUrls = pages
        .filter((p) => p.statusCode === 404)
        .reduce((sum, p) => sum + p.internalLinksIn, 0);
      return { status: statusFor(affectedUrls, 5), affectedUrls };
    },
  },
  {
    slug: "crawlability",
    label: "Crawlability",
    description: "Every important page should be reachable through internal links so crawlers can discover it without relying solely on the sitemap.",
    category: "crawlability",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.isOrphan).length;
      return { status: statusFor(affectedUrls, 3), affectedUrls };
    },
  },
  {
    slug: "crawl-depth",
    label: "Crawl Depth",
    description: "Key pages should be reachable within a few clicks of the homepage; deeply nested pages get crawled and refreshed less often.",
    category: "crawlability",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.crawlDepth > 3).length;
      return { status: statusFor(affectedUrls, Math.max(4, Math.ceil(pages.length * 0.25))), affectedUrls };
    },
  },
  {
    slug: "duplicate-urls",
    label: "Duplicate URLs",
    description: "Multiple URLs should not serve near-identical titles and content, which splits ranking signals between them.",
    category: "duplicate_content",
    evaluate: (pages) => {
      const titleCounts = new Map<string, number>();
      pages.forEach((p) => titleCounts.set(p.title, (titleCounts.get(p.title) ?? 0) + 1));
      const affectedUrls = pages.filter((p) => (titleCounts.get(p.title) ?? 0) > 1).length;
      return { status: statusFor(affectedUrls, 4), affectedUrls };
    },
  },
  {
    slug: "mobile-usability",
    label: "Mobile Usability",
    description: "Pages should load quickly and stay easy to interact with on mobile devices.",
    category: "mobile",
    evaluate: (pages) => {
      const affectedUrls = pages.filter((p) => p.loadTimeMs > 3500).length;
      return { status: statusFor(affectedUrls, Math.max(4, Math.ceil(pages.length * 0.2))), affectedUrls };
    },
  },
  {
    slug: "javascript-rendering",
    label: "JavaScript Rendering",
    description: "Primary content should be present without requiring JavaScript execution, so it isn't missed or delayed during indexing.",
    category: "javascript",
    evaluate: (pages, rng) => {
      const affectedUrls = pages.filter((p) => p.wordCount < 250).length;
      if (affectedUrls === 0 && chance(rng, 0.12)) {
        return { status: "not_applicable", affectedUrls: 0 };
      }
      return { status: statusFor(affectedUrls, Math.max(3, Math.ceil(pages.length * 0.15))), affectedUrls };
    },
  },
];

/** Deterministic per-website technical SEO checklist, grounded in that website's crawled pages. */
export function getTechnicalChecks(websiteId: string): TechnicalCheck[] {
  const rng = rngFor(`technical-checks-${websiteId}`);
  const pages = getPagesByWebsite(websiteId);

  return CHECK_DEFINITIONS.map((def) => {
    const { status, affectedUrls } = def.evaluate(pages, rng);
    return {
      id: `${websiteId}_tc_${def.slug}`,
      label: def.label,
      description: def.description,
      status,
      affectedUrls,
      category: def.category,
    };
  });
}
