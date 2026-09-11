import { Bot, User } from "lucide-react";
import { cn } from "cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { formatRelativeTime } from "@/lib/format";
import type { ChatMessage } from "./types";

const SECTION_LABELS: { key: keyof Omit<NonNullable<ChatMessage["structured"]>, "priority">; label: string }[] = [
  { key: "analysis", label: "Analysis" },
  { key: "evidence", label: "Evidence" },
  { key: "recommendation", label: "Recommendation" },
  { key: "expectedImpact", label: "Expected impact" },
  { key: "nextAction", label: "Suggested next action" },
];

export function MessageBubble({
  message,
  isLatest,
  onFollowUp,
}: {
  message: ChatMessage;
  isLatest: boolean;
  onFollowUp: (text: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarFallback className={cn(isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
          {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("min-w-0 max-w-[85%] space-y-2", isUser && "flex flex-col items-end")}>
        {message.structured ? (
          <div className="w-full space-y-2.5 rounded-xl border bg-card p-3.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Priority</span>
              <PriorityBadge priority={message.structured.priority} />
            </div>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SECTION_LABELS.map(({ key, label }) => (
                <div key={key} className="space-y-0.5 rounded-lg bg-muted/50 p-2.5">
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <dd className="text-foreground">{message.structured![key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <div
            className={cn(
              "w-full rounded-xl px-3.5 py-2.5 text-sm",
              isUser ? "bg-primary text-primary-foreground" : "border bg-card text-foreground",
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-0.5">
            <span className="text-xs text-muted-foreground">Sources:</span>
            {message.citations.map((citation, i) => (
              <span key={i} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {citation.label}
              </span>
            ))}
          </div>
        )}

        {isLatest && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-0.5 pt-0.5">
            {message.suggestedFollowUps.map((followUp) => (
              <Button key={followUp} type="button" variant="outline" size="sm" className="h-7 rounded-full text-xs" onClick={() => onFollowUp(followUp)}>
                {followUp}
              </Button>
            ))}
          </div>
        )}

        <p className={cn("px-0.5 text-xs text-muted-foreground", isUser && "text-right")}>{formatRelativeTime(message.createdAt)}</p>
      </div>
    </div>
  );
}
