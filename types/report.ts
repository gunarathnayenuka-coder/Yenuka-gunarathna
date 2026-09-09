export type ReportType =
  | "weekly_seo"
  | "monthly_seo"
  | "technical_seo"
  | "keyword"
  | "content"
  | "competitor";

export interface Report {
  id: string;
  clientId: string;
  websiteId: string;
  type: ReportType;
  title: string;
  dateRange: { from: string; to: string };
  status: "draft" | "generated" | "sent" | "scheduled";
  generatedAt?: string;
  sentAt?: string;
  summary?: string;
  fileUrl?: string;
}

export interface ReportSchedule {
  id: string;
  clientId: string;
  type: ReportType;
  frequency: "weekly" | "monthly";
  recipients: string[];
  nextSendAt: string;
  isEnabled: boolean;
}
