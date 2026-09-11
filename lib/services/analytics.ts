import type { GA4LandingPage, GA4Summary, GSCPageRow, GSCQueryRow, GSCSummary, TrafficChangeInsight } from "@/types";
import {
  getGA4LandingPages,
  getGA4Summary,
  getGSCPages,
  getGSCQueries,
  getGSCSummary,
  getTrafficChangeInsight,
} from "@/lib/mock-data/analytics";
import { simulateLatency } from "./latency";

export async function fetchGSCSummary(websiteId: string): Promise<GSCSummary> {
  await simulateLatency();
  return getGSCSummary(websiteId);
}

export async function fetchGSCQueries(websiteId: string): Promise<GSCQueryRow[]> {
  await simulateLatency();
  return getGSCQueries(websiteId);
}

export async function fetchGSCPages(websiteId: string): Promise<GSCPageRow[]> {
  await simulateLatency();
  return getGSCPages(websiteId);
}

export async function fetchGA4Summary(websiteId: string): Promise<GA4Summary> {
  await simulateLatency();
  return getGA4Summary(websiteId);
}

export async function fetchGA4LandingPages(websiteId: string): Promise<GA4LandingPage[]> {
  await simulateLatency();
  return getGA4LandingPages(websiteId);
}

export async function fetchTrafficChangeInsight(websiteId: string): Promise<TrafficChangeInsight> {
  await simulateLatency();
  return getTrafficChangeInsight(websiteId);
}
