import type { Report, ReportType } from "@/types";

export const REPORT_TYPES: ReportType[] = [
  "weekly_seo",
  "monthly_seo",
  "technical_seo",
  "keyword",
  "content",
  "competitor",
];

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  weekly_seo: "Weekly SEO",
  monthly_seo: "Monthly SEO",
  technical_seo: "Technical SEO",
  keyword: "Keyword",
  content: "Content",
  competitor: "Competitor",
};

export const REPORT_STATUS_LABELS: Record<Report["status"], string> = {
  draft: "Draft",
  generated: "Generated",
  sent: "Sent",
  scheduled: "Scheduled",
};

export const DATE_RANGE_PRESETS = ["Last 7 days", "Last 30 days", "Last quarter", "Custom"] as const;
export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number];

export const SECTION_OPTIONS = [
  { key: "traffic", label: "Traffic" },
  { key: "rankings", label: "Rankings" },
  { key: "technical", label: "Technical Audit" },
  { key: "content", label: "Content Performance" },
  { key: "competitor", label: "Competitor Summary" },
] as const;
export type SectionKey = (typeof SECTION_OPTIONS)[number]["key"];

/** Small preset palette for the report builder's cosmetic branding picker. */
export const BRAND_COLORS = ["#e94560", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0f172a"];
