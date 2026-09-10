import type { ContentAuditFinding, ContentBrief, ContentItem, TopicCluster } from "@/types";
import {
  getContentAuditFindingsByWebsite,
  getContentBriefsByWebsite,
  getContentByWebsite,
  getTopicClustersByWebsite,
} from "@/lib/mock-data/content";
import { simulateLatency } from "./latency";

export async function fetchContentItems(websiteId: string): Promise<ContentItem[]> {
  await simulateLatency();
  return getContentByWebsite(websiteId);
}

export async function fetchContentBriefs(websiteId: string): Promise<ContentBrief[]> {
  await simulateLatency();
  return getContentBriefsByWebsite(websiteId);
}

export async function fetchContentAuditFindings(websiteId: string): Promise<ContentAuditFinding[]> {
  await simulateLatency();
  return getContentAuditFindingsByWebsite(websiteId);
}

export async function fetchTopicClusters(websiteId: string): Promise<TopicCluster[]> {
  await simulateLatency();
  return getTopicClustersByWebsite(websiteId);
}
