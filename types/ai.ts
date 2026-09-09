import type { EffortLevel, ImpactLevel, RecommendationPriority } from "./common";

export type RecommendationCategory =
  | "technical"
  | "content"
  | "keywords"
  | "links"
  | "performance"
  | "local";

export interface AIRecommendation {
  id: string;
  websiteId: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  title: string;
  reason: string;
  recommendation: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  relatedUrl?: string;
  status: "new" | "in_progress" | "done" | "dismissed";
  createdAt: string;
}

export interface AIConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  citations?: { label: string; href?: string }[];
  suggestedFollowUps?: string[];
}

export interface AIConversation {
  id: string;
  title: string;
  websiteId?: string;
  messages: AIConversationMessage[];
  updatedAt: string;
}

export const AI_PROMPT_STARTERS = [
  "Why did organic traffic drop this month?",
  "Which keywords should we target next?",
  "What pages need optimization right now?",
  "Find new content opportunities for us.",
  "Why is this page not performing?",
  "Give me this month's SEO strategy.",
] as const;
