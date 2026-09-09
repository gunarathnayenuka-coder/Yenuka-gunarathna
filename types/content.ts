import type { SearchIntent } from "./common";

export type ContentStatus =
  | "idea"
  | "brief"
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "needs_update";

export type ContentType = "blog_post" | "landing_page" | "product_page" | "guide" | "case_study";

export interface ContentItem {
  id: string;
  websiteId: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  status: ContentStatus;
  type: ContentType;
  authorId: string;
  targetUrl: string;
  seoScore: number | null;
  wordCount: number;
  dueDate?: string;
  publishedAt?: string;
  updatedAt: string;
  clusterId?: string;
}

export interface ContentBrief {
  id: string;
  contentItemId: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  suggestedTitle: string;
  suggestedMetaDescription: string;
  targetWordCount: number;
  subtopics: string[];
  questionsToAnswer: string[];
  competitorUrls: string[];
  internalLinkSuggestions: string[];
  tone: string;
  audience: string;
}

export interface ContentAuditFinding {
  id: string;
  contentItemId: string;
  url: string;
  issue: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

export interface TopicCluster {
  id: string;
  websiteId: string;
  name: string;
  pillarUrl: string;
  supportingContentIds: string[];
  totalVolume: number;
  coverageScore: number; // 0-100, how well covered vs. gaps
  status: "strong" | "developing" | "weak";
}
