import type { AIConversation } from "@/types";
import { getConversationById } from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function fetchConversation(id: string): Promise<AIConversation | undefined> {
  await simulateLatency();
  return getConversationById(id);
}
