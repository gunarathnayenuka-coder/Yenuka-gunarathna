import type { Report, ReportSchedule } from "@/types";
import { getReportsByClient, getSchedulesByClient, reports } from "@/lib/mock-data/reports";
import { simulateLatency } from "./latency";

export async function listReports(): Promise<Report[]> {
  await simulateLatency();
  return reports;
}

export async function fetchReportsByClient(clientId: string): Promise<Report[]> {
  await simulateLatency();
  return getReportsByClient(clientId);
}

export async function fetchSchedulesByClient(clientId: string): Promise<ReportSchedule[]> {
  await simulateLatency();
  return getSchedulesByClient(clientId);
}
