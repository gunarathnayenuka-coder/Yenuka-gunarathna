import type { Backlink, LinkOpportunity, ReferringDomain } from "@/types";
import {
  getBacklinksByWebsite,
  getLinkOpportunitiesByWebsite,
  getLostBacklinks,
  getNewBacklinks,
  getReferringDomainsByWebsite,
} from "@/lib/mock-data/backlinks";
import { simulateLatency } from "./latency";

export async function fetchBacklinks(websiteId: string): Promise<Backlink[]> {
  await simulateLatency();
  return getBacklinksByWebsite(websiteId);
}

export async function fetchNewBacklinks(websiteId: string): Promise<Backlink[]> {
  await simulateLatency();
  return getNewBacklinks(websiteId);
}

export async function fetchLostBacklinks(websiteId: string): Promise<Backlink[]> {
  await simulateLatency();
  return getLostBacklinks(websiteId);
}

export async function fetchReferringDomains(websiteId: string): Promise<ReferringDomain[]> {
  await simulateLatency();
  return getReferringDomainsByWebsite(websiteId);
}

export async function fetchLinkOpportunities(websiteId: string): Promise<LinkOpportunity[]> {
  await simulateLatency();
  return getLinkOpportunitiesByWebsite(websiteId);
}
