import type { CrawlRun, Website, WebsitePage } from "@/types";
import {
  crawlRuns,
  getPagesByWebsite,
  getTrafficHistory,
  getWebsiteById,
  getWebsitesByClient,
  websites,
  type TrafficHistoryPoint,
} from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function listWebsites(): Promise<Website[]> {
  await simulateLatency();
  return websites;
}

export async function listWebsitesByClient(clientId: string): Promise<Website[]> {
  await simulateLatency();
  return getWebsitesByClient(clientId);
}

export async function fetchWebsite(id: string): Promise<Website | undefined> {
  await simulateLatency();
  return getWebsiteById(id);
}

export async function fetchWebsitePages(websiteId: string): Promise<WebsitePage[]> {
  await simulateLatency();
  return getPagesByWebsite(websiteId);
}

export async function fetchCrawlRuns(websiteId: string): Promise<CrawlRun[]> {
  await simulateLatency();
  return crawlRuns
    .filter((c) => c.websiteId === websiteId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

/** Default website shown when no explicit selection exists yet (e.g. first load). */
export async function fetchDefaultWebsite(): Promise<Website> {
  await simulateLatency();
  return websites[0];
}

export async function fetchTrafficHistory(websiteId: string): Promise<TrafficHistoryPoint[]> {
  await simulateLatency();
  return getTrafficHistory(websiteId);
}
