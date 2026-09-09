export type AutomationFrequency = "hourly" | "daily" | "weekly" | "monthly";

export type AutomationTrigger =
  | "schedule"
  | "ranking_drop"
  | "traffic_drop"
  | "new_backlink"
  | "technical_issue"
  | "crawl_complete";

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  frequency?: AutomationFrequency;
  scope: "all_websites" | "website";
  websiteId?: string;
  isEnabled: boolean;
  lastRunAt?: string;
  lastRunStatus?: "success" | "failed" | "partial";
  nextRunAt?: string;
  actions: string[];
}

export interface AutomationRun {
  id: string;
  ruleId: string;
  startedAt: string;
  finishedAt?: string;
  status: "queued" | "running" | "success" | "failed";
  summary?: string;
  itemsProcessed?: number;
}
