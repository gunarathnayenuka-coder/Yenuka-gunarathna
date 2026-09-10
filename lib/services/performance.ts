import type { CoreWebVitalsSummary } from "@/types";
import { getCoreWebVitalsSummary } from "@/lib/mock-data/performance";
import { simulateLatency } from "./latency";

export async function fetchCoreWebVitalsSummary(websiteId: string): Promise<CoreWebVitalsSummary> {
  await simulateLatency();
  return getCoreWebVitalsSummary(websiteId);
}
