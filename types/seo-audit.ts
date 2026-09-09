import type { IssueStatus, Severity } from "./common";

export type SEOIssueCategory =
  | "technical"
  | "on_page"
  | "performance"
  | "schema"
  | "internal_linking"
  | "mobile"
  | "content";

export interface SEOIssue {
  id: string;
  websiteId: string;
  category: SEOIssueCategory;
  title: string;
  description: string;
  recommendation: string;
  severity: Severity;
  status: IssueStatus;
  url: string;
  affectedPages: number;
  detectedAt: string;
  assigneeId?: string;
  resolvedAt?: string;
}

export interface SEOScoreBreakdown {
  overall: number;
  technical: number;
  onPage: number;
  content: number;
  performance: number;
  internalLinking: number;
  schema: number;
  authority: number;
  local?: number;
}

export interface SEOScoreHistoryPoint {
  date: string;
  overall: number;
}

export type TechnicalCheckStatus = "pass" | "warning" | "fail" | "not_applicable";

export interface TechnicalCheck {
  id: string;
  label: string;
  description: string;
  status: TechnicalCheckStatus;
  affectedUrls: number;
  category:
    | "indexability"
    | "crawlability"
    | "sitemap_robots"
    | "redirects"
    | "duplicate_content"
    | "mobile"
    | "javascript";
}

export type CoreWebVitalRating = "good" | "needs_improvement" | "poor";

export interface CoreWebVitalsSummary {
  lcpMs: number;
  lcpRating: CoreWebVitalRating;
  inpMs: number;
  inpRating: CoreWebVitalRating;
  cls: number;
  clsRating: CoreWebVitalRating;
  mobileScore: number;
  desktopScore: number;
  pctUrlsGood: number;
}

export type SchemaType =
  | "Organization"
  | "LocalBusiness"
  | "Product"
  | "Article"
  | "FAQPage"
  | "BreadcrumbList"
  | "Review"
  | "WebSite";

export interface SchemaCoverage {
  type: SchemaType;
  pagesEligible: number;
  pagesImplemented: number;
  pagesWithErrors: number;
}
