import type { Competitor, CompetitorContentGap, CompetitorKeywordGap, CompetitorPage } from "@/types";
import {
  getCompetitorPagesByCompetitor,
  getCompetitorsByWebsite,
  getContentGapsByWebsite,
  getKeywordGapsByWebsite,
} from "@/lib/mock-data/competitors";
import { simulateLatency } from "./latency";

export async function fetchCompetitors(websiteId: string): Promise<Competitor[]> {
  await simulateLatency();
  return getCompetitorsByWebsite(websiteId);
}

export async function fetchCompetitorKeywordGaps(websiteId: string): Promise<CompetitorKeywordGap[]> {
  await simulateLatency();
  return getKeywordGapsByWebsite(websiteId);
}

export async function fetchCompetitorContentGaps(websiteId: string): Promise<CompetitorContentGap[]> {
  await simulateLatency();
  return getContentGapsByWebsite(websiteId);
}

export async function fetchCompetitorPages(competitorId: string): Promise<CompetitorPage[]> {
  await simulateLatency();
  return getCompetitorPagesByCompetitor(competitorId);
}
