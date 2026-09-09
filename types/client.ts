import type { Address } from "./common";

export type ClientStatus = "active" | "onboarding" | "paused" | "churned";

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  country: string;
  status: ClientStatus;
  websiteIds: string[];
  primaryWebsiteId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: Address;
  targetAudience?: string;
  monthlyBudget?: number;
  accountManagerId: string;
  seoHealthScore: number;
  organicTraffic: number;
  organicTrafficChangePct: number;
  trackedKeywords: number;
  top10Keywords: number;
  openIssues: number;
  lastAuditAt: string;
  createdAt: string;
}

export interface ClientActivityEvent {
  id: string;
  clientId: string;
  type:
    | "audit_completed"
    | "content_published"
    | "report_sent"
    | "issue_resolved"
    | "keyword_ranked"
    | "note";
  message: string;
  actor: string;
  createdAt: string;
}
