import type { RecommendationPriority } from "./common";

export type NotificationType =
  | "ranking_drop"
  | "ranking_gain"
  | "traffic_increase"
  | "traffic_drop"
  | "critical_issue"
  | "audit_completed"
  | "report_generated"
  | "competitor_change"
  | "keyword_opportunity"
  | "new_backlink"
  | "lost_backlink";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: RecommendationPriority;
  title: string;
  message: string;
  websiteId?: string;
  clientId?: string;
  isRead: boolean;
  createdAt: string;
  href?: string;
}
