export type BacklinkStatus = "active" | "new" | "lost" | "suspicious";

export interface Backlink {
  id: string;
  websiteId: string;
  sourceUrl: string;
  sourceDomain: string;
  domainRating: number;
  anchorText: string;
  targetUrl: string;
  linkType: "dofollow" | "nofollow" | "ugc" | "sponsored";
  status: BacklinkStatus;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface ReferringDomain {
  id: string;
  domain: string;
  domainRating: number;
  backlinksCount: number;
  isNew: boolean;
  relevance: "high" | "medium" | "low";
  firstSeenAt: string;
}

export interface LinkOpportunity {
  id: string;
  websiteId: string;
  targetDomain: string;
  domainRating: number;
  reason: string;
  linksToCompetitorIds: string[];
  relevance: "high" | "medium" | "low";
  status: "identified" | "in_outreach" | "acquired" | "declined";
}
