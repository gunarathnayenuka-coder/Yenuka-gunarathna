import type { Notification } from "@/types";
import { getRecentNotifications, getUnreadCount, notifications } from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function listNotifications(): Promise<Notification[]> {
  await simulateLatency();
  return [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function fetchRecentNotifications(limit = 8): Promise<Notification[]> {
  await simulateLatency();
  return getRecentNotifications(limit);
}

export async function fetchUnreadCount(): Promise<number> {
  await simulateLatency();
  return getUnreadCount();
}
