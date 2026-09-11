import type { LocalKeywordRank, LocalReview, LocalSEOProfile, LocationPage } from "@/types";
import { getLocalKeywordRanks, getLocalProfile, getLocalReviews, getLocationPages } from "@/lib/mock-data/local-seo";
import { simulateLatency } from "./latency";

export async function fetchLocalProfile(websiteId: string): Promise<LocalSEOProfile | undefined> {
  await simulateLatency();
  return getLocalProfile(websiteId);
}

export async function fetchLocalKeywordRanks(websiteId: string): Promise<LocalKeywordRank[]> {
  await simulateLatency();
  return getLocalKeywordRanks(websiteId);
}

export async function fetchLocalReviews(websiteId: string): Promise<LocalReview[]> {
  await simulateLatency();
  return getLocalReviews(websiteId);
}

export async function fetchLocationPages(websiteId: string): Promise<LocationPage[]> {
  await simulateLatency();
  return getLocationPages(websiteId);
}
