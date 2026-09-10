import type { SchemaCoverage } from "@/types";
import { getSchemaCoverage } from "@/lib/mock-data/schema-coverage";
import { simulateLatency } from "./latency";

export async function fetchSchemaCoverage(websiteId: string): Promise<SchemaCoverage[]> {
  await simulateLatency();
  return getSchemaCoverage(websiteId);
}
