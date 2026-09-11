"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { Bot, Info, Plus, Send } from "lucide-react";
import type { AIConversation } from "@/types";
import { AI_PROMPT_STARTERS } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format";
import { daysAgo } from "@/lib/mock-data/rng";
import { MessageBubble } from "./message-bubble";
import { buildReply } from "./reply-templates";
import type { ChatMessage } from "./types";

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function newLocalId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Moves the active conversation to the top of the sidebar list, creating it on first message. */
function upsertConversation(list: AIConversation[], id: string, firstUserText: string, messages: ChatMessage[]): AIConversation[] {
  const existing = list.find((c) => c.id === id);
  const updated: AIConversation = {
    id,
    title: existing?.title ?? truncate(firstUserText, 60),
    websiteId: existing?.websiteId,
    messages,
    updatedAt: daysAgo(0),
  };
  return [updated, ...list.filter((c) => c.id !== id)];
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="size-3.5" />
      </div>
      <div className="flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm text-muted-foreground">
        <span>Aviance is thinking</span>
        <span className="flex items-center gap-0.5">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
        </span>
      </div>
    </div>
  );
}

export function AIAssistantChat({
  initialConversation,
  conversations,
  websiteDomain,
}: {
  initialConversation: AIConversation;
  conversations: AIConversation[];
  websiteDomain: string;
}) {
  const [sidebarConversations, setSidebarConversations] = useState<AIConversation[]>(conversations);
  const [activeId, setActiveId] = useState(initialConversation.id);
  const [messages, setMessages] = useState<ChatMessage[]>(initialConversation.messages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const messagesRef = useRef<ChatMessage[]>(initialConversation.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  const selectConversation = useCallback(
    (conversation: AIConversation) => {
      if (isThinking) return;
      setActiveId(conversation.id);
      setMessages(conversation.messages);
      messagesRef.current = conversation.messages;
      setInput("");
    },
    [isThinking],
  );

  const startNewChat = useCallback(() => {
    if (isThinking) return;
    setActiveId(newLocalId("local"));
    setMessages([]);
    messagesRef.current = [];
    setInput("");
  }, [isThinking]);

  const handleSend = useCallback(
    (rawText?: string) => {
      const text = (rawText ?? input).trim();
      if (!text || isThinking) return;

      const userMessage: ChatMessage = {
        id: newLocalId("msg"),
        role: "user",
        content: text,
        createdAt: daysAgo(0),
      };
      const withUserMessage = [...messagesRef.current, userMessage];
      setMessages(withUserMessage);
      messagesRef.current = withUserMessage;
      setSidebarConversations((prev) => upsertConversation(prev, activeId, text, withUserMessage));
      setInput("");
      setIsThinking(true);

      const delay = 600 + Math.random() * 600;
      window.setTimeout(() => {
        const reply = buildReply(text, websiteDomain);
        const assistantMessage: ChatMessage = {
          id: newLocalId("msg"),
          role: "assistant",
          content: reply.sections.analysis,
          createdAt: daysAgo(0),
          suggestedFollowUps: reply.suggestedFollowUps,
          structured: reply.sections,
        };
        const withReply = [...messagesRef.current, assistantMessage];
        setMessages(withReply);
        messagesRef.current = withReply;
        setSidebarConversations((prev) => upsertConversation(prev, activeId, text, withReply));
        setIsThinking(false);
      }, delay);
    },
    [input, isThinking, activeId, websiteDomain],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <Card className="hidden h-[640px] flex-col lg:flex">
        <CardHeader>
          <CardTitle className="text-sm">Conversations</CardTitle>
          <CardAction>
            <Button size="icon-sm" variant="outline" disabled={isThinking} onClick={startNewChat} aria-label="New chat">
              <Plus />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 space-y-1 overflow-y-auto">
          {sidebarConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              disabled={isThinking}
              onClick={() => selectConversation(conversation)}
              className={cn(
                "w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent/60 disabled:pointer-events-none disabled:opacity-60",
                conversation.id === activeId && "bg-accent",
              )}
            >
              <p className="truncate text-sm font-medium">{conversation.title}</p>
              <p className="truncate text-xs text-muted-foreground">{formatRelativeTime(conversation.updatedAt)}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="flex h-[640px] flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-sm">Ask Aviance</CardTitle>
          <CardDescription>Ask about {websiteDomain}&apos;s rankings, traffic, content, or strategy.</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline" disabled={isThinking} onClick={startNewChat} className="lg:hidden">
              <Plus /> New chat
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 overflow-y-auto py-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bot className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ask me anything about {websiteDomain}</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  I can help you understand traffic, prioritize keywords, find content opportunities, and plan next steps.
                </p>
              </div>
              <div className="flex max-w-lg flex-wrap justify-center gap-2">
                {AI_PROMPT_STARTERS.map((prompt) => (
                  <Button key={prompt} type="button" variant="outline" size="sm" onClick={() => handleSend(prompt)}>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, i) => (
                <MessageBubble key={message.id} message={message} isLatest={i === messages.length - 1} onFollowUp={handleSend} />
              ))}
              {isThinking && <ThinkingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2 border-t pt-4">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3.5 shrink-0" />
            AI recommends — you decide. Review suggested actions before your team acts on them.
          </p>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about rankings, traffic, content, or strategy..."
              className="min-h-9 flex-1 resize-none"
              rows={1}
              disabled={isThinking}
            />
            <Button type="submit" size="icon" disabled={isThinking || !input.trim()} aria-label="Send message">
              <Send />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
