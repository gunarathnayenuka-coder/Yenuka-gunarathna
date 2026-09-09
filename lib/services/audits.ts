import type { SEOIssue, SEOScoreBreakdown, SEOScoreHistoryPoint } from "@/types";
import { getIssuesByWebsite, getScoreBreakdown, getScoreHistory } from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function fetchIssues(websiteId: string): Promise<SEOIssue[]> {
  await simulateLatency();
  return getIssuesByWebsite(websiteId).sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
  );
}

export async function fetchScoreBreakdown(websiteId: string): Promise<SEOScoreBreakdown> {
  await simulateLatency();
  return getScoreBreakdown(websiteId);
}

export async function fetchScoreHistory(websiteId: string): Promise<SEOScoreHistoryPoint[]> {
  await simulateLatency();
  return getScoreHistory(websiteId);
}
