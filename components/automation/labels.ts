import type { AutomationFrequency, AutomationTrigger } from "@/types";

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  schedule: "Schedule",
  ranking_drop: "Ranking drop",
  traffic_drop: "Traffic drop",
  new_backlink: "New backlink",
  technical_issue: "Technical issue",
  crawl_complete: "Crawl complete",
};

export const FREQUENCY_LABELS: Record<AutomationFrequency, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};
