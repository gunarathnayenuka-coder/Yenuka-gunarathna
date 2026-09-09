import type { SearchIntent, TrendDirection } from "./common";

export interface Keyword {
  id: string;
  websiteId: string;
  keyword: string;
  intent: SearchIntent;
  volume: number;
  difficulty: number; // 0-100
  cpc: number;
  currentRank: number | null;
  previousRank: number | null;
  bestRank: number | null;
  url: string | null;
  trend: TrendDirection;
  opportunityScore: number; // 0-100
  isTracked: boolean;
  tags: string[];
  rankingHistory: { date: string; rank: number | null }[];
  updatedAt: string;
}

export interface KeywordGroup {
  id: string;
  name: string;
  keywordIds: string[];
  pillarUrl?: string;
}

export interface CannibalizationIssue {
  id: string;
  websiteId: string;
  keyword: string;
  urls: { url: string; rank: number | null; title: string }[];
  recommendedPrimaryUrl: string;
  recommendation: string;
  severity: "high" | "medium" | "low";
  detectedAt: string;
}

export interface KeywordOpportunity {
  id: string;
  websiteId: string;
  keyword: string;
  volume: number;
  difficulty: number;
  intent: SearchIntent;
  currentRank: number | null;
  opportunityScore: number;
  reason: string;
  suggestedUrl?: string;
  suggestedAction: "optimize_existing" | "create_content" | "build_links" | "fix_technical";
}
