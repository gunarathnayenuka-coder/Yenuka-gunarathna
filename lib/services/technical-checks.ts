import type { TechnicalCheck } from "@/types";
import { getTechnicalChecks } from "@/lib/mock-data/technical-checks";
import { simulateLatency } from "./latency";

export async function fetchTechnicalChecks(websiteId: string): Promise<TechnicalCheck[]> {
  await simulateLatency();
  return getTechnicalChecks(websiteId);
}
