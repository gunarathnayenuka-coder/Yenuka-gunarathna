import type { SchemaCoverage, SchemaType, WebsitePage } from "@/types";
import { getPagesByWebsite } from "./websites";
import { randFloat, rngFor } from "./rng";
import type { Rng } from "./rng";

const SCHEMA_TYPES: SchemaType[] = [
  "Organization",
  "LocalBusiness",
  "Product",
  "Article",
  "FAQPage",
  "BreadcrumbList",
  "Review",
  "WebSite",
];

/** Pages that carry sitewide identity markup (Organization/WebSite) via the base template. */
const CORE_PATHS = new Set(["/", "/about", "/contact", "/services"]);

const ELIGIBILITY: Record<SchemaType, (page: WebsitePage) => boolean> = {
  Organization: (p) => CORE_PATHS.has(p.path) || p.path.startsWith("/locations/"),
  WebSite: (p) => CORE_PATHS.has(p.path),
  LocalBusiness: (p) => p.path === "/" || p.path.includes("contact") || p.path.startsWith("/locations/"),
  Product: (p) => p.path.startsWith("/services/") || p.path === "/pricing",
  Article: (p) => p.path.startsWith("/blog/"),
  FAQPage: (p) => p.path.includes("faq") || p.path.startsWith("/blog/"),
  BreadcrumbList: (p) => p.path !== "/",
  Review: (p) => p.path.includes("testimonials") || p.path.startsWith("/services/") || p.path === "/",
};

function implementedCount(eligiblePages: WebsitePage[], type: SchemaType, rng: Rng): number {
  const direct = eligiblePages.filter((p) => p.schemaTypes.includes(type)).length;
  if (direct > 0) return direct;
  // Product/Review/WebSite aren't tracked individually in the per-page mock data;
  // approximate from how many eligible pages already carry *some* schema markup.
  const withAnySchema = eligiblePages.filter((p) => p.hasSchema).length;
  if (withAnySchema === 0) return 0;
  return Math.round(withAnySchema * randFloat(rng, 0.2, 0.7, 2));
}

/** Deterministic per-website schema.org coverage, grounded in that website's crawled pages. */
export function getSchemaCoverage(websiteId: string): SchemaCoverage[] {
  const rng = rngFor(`schema-coverage-${websiteId}`);
  const pages = getPagesByWebsite(websiteId);

  return SCHEMA_TYPES.map((type) => {
    const eligiblePages = pages.filter(ELIGIBILITY[type]);
    const pagesImplemented = Math.min(eligiblePages.length, implementedCount(eligiblePages, type, rng));
    const pagesWithErrors = pagesImplemented > 0 ? Math.round(pagesImplemented * randFloat(rng, 0, 0.22, 2)) : 0;

    return {
      type,
      pagesEligible: eligiblePages.length,
      pagesImplemented,
      pagesWithErrors,
    };
  });
}
