import type { AIConversationMessage, RecommendationPriority } from "@/types";

/**
 * The six labeled sections every live-generated assistant reply is broken
 * into, per the product's "AI recommends" structure. Historical/seed
 * messages loaded from `aiConversations` don't carry this — they render as
 * plain prose instead (see MessageBubble).
 */
export interface StructuredReplySections {
  analysis: string;
  evidence: string;
  priority: RecommendationPriority;
  recommendation: string;
  expectedImpact: string;
  nextAction: string;
}

/** Client-only superset of AIConversationMessage — never persisted, local chat state only. */
export interface ChatMessage extends AIConversationMessage {
  structured?: StructuredReplySections;
}
