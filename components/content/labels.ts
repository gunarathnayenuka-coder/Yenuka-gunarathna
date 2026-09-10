import type { ContentStatus, ContentType } from "@/types";

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  blog_post: "Blog Post",
  landing_page: "Landing Page",
  product_page: "Product Page",
  guide: "Guide",
  case_study: "Case Study",
};

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  idea: "Idea",
  brief: "Brief",
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  published: "Published",
  needs_update: "Needs Update",
};

/** Board/status-breakdown column order, matching the content lifecycle. */
export const CONTENT_STATUS_ORDER: ContentStatus[] = [
  "idea",
  "brief",
  "draft",
  "review",
  "approved",
  "published",
  "needs_update",
];

/** Solid swatch classes for the status-breakdown strip (needs to read at a glance, unlike the softer badge tints). */
export const CONTENT_STATUS_BAR_CLASS: Record<ContentStatus, string> = {
  idea: "bg-muted-foreground",
  brief: "bg-info",
  draft: "bg-primary",
  review: "bg-warning",
  approved: "bg-chart-2",
  published: "bg-success",
  needs_update: "bg-critical",
};

export const TONE_OPTIONS = ["Professional", "Friendly", "Authoritative", "Conversational"] as const;
export type Tone = (typeof TONE_OPTIONS)[number];

export const TARGET_LENGTH_OPTIONS = [
  { value: "short", label: "Short (~500 words)", words: 500 },
  { value: "medium", label: "Medium (~1200 words)", words: 1200 },
  { value: "long", label: "Long (~2500 words)", words: 2500 },
] as const;
export type TargetLength = (typeof TARGET_LENGTH_OPTIONS)[number]["value"];

/** Same score-banding used across the app: <60 critical, <80 warning, else success. */
export function seoScoreTextClass(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score < 60) return "text-critical";
  if (score < 80) return "text-warning";
  return "text-success";
}

/** Pill version of the same banding, for the planner board's SEO score badge. */
export function seoScoreBadgeClass(score: number): string {
  if (score < 60) return "bg-critical/10 text-critical border-critical/20";
  if (score < 80) return "bg-warning/10 text-warning border-warning/20";
  return "bg-success/10 text-success border-success/20";
}
