import type { AIRecommendation } from "@/types";
import { getRecommendationsByWebsite, sortByPriority } from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function fetchRecommendations(websiteId: string): Promise<AIRecommendation[]> {
  await simulateLatency();
  return sortByPriority(getRecommendationsByWebsite(websiteId));
}
