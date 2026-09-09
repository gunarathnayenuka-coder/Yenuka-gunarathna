/** Shared enums and primitives used across every module. */

export type Severity = "critical" | "high" | "medium" | "low";

export type RecommendationPriority = "critical" | "high" | "medium" | "low" | "opportunity";

export type IssueStatus = "open" | "in_progress" | "resolved" | "ignored";

export type TrendDirection = "up" | "down" | "flat" | "new" | "lost";

export type SearchIntent = "informational" | "navigational" | "commercial" | "transactional";

export type Role =
  | "super_admin"
  | "agency_owner"
  | "seo_manager"
  | "seo_specialist"
  | "content_writer"
  | "client";

export type PlanTier = "starter" | "growth" | "agency" | "enterprise";

export type EffortLevel = "low" | "medium" | "high";

export type ImpactLevel = "low" | "medium" | "high";

export interface DateRange {
  from: string; // ISO date
  to: string; // ISO date
}

export interface TimeSeriesPoint {
  date: string; // ISO date
  value: number;
}

export interface NamedSeries {
  label: string;
  data: TimeSeriesPoint[];
}

export interface Address {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

export const SEARCH_INTENTS: SearchIntent[] = [
  "informational",
  "navigational",
  "commercial",
  "transactional",
];
