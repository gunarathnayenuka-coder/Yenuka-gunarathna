import type { AutomationRule, AutomationRun } from "@/types";
import { automationRules, getRunsByRule } from "@/lib/mock-data/automation";
import { simulateLatency } from "./latency";

export async function listAutomationRules(): Promise<AutomationRule[]> {
  await simulateLatency();
  return automationRules;
}

export async function fetchRunsByRule(ruleId: string): Promise<AutomationRun[]> {
  await simulateLatency();
  return getRunsByRule(ruleId);
}
