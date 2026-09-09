import type { CannibalizationIssue, Keyword, KeywordOpportunity } from "@/types";
import { cannibalizationIssues, getKeywordsByWebsite, keywordOpportunities } from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function fetchKeywords(websiteId: string): Promise<Keyword[]> {
  await simulateLatency();
  return getKeywordsByWebsite(websiteId);
}

export async function fetchKeywordOpportunities(websiteId: string): Promise<KeywordOpportunity[]> {
  await simulateLatency();
  return keywordOpportunities
    .filter((o) => o.websiteId === websiteId)
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export async function fetchCannibalizationIssues(websiteId: string): Promise<CannibalizationIssue[]> {
  await simulateLatency();
  return cannibalizationIssues.filter((c) => c.websiteId === websiteId);
}
