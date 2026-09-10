"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";
import { ExternalLink, Sparkles } from "lucide-react";
import type { ContentBrief, ContentItem } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, initials } from "@/lib/format";
import { INTENT_BADGE_CLASS, INTENT_LABELS } from "@/lib/labels";
import { ContentStatusBadge } from "./content-status-badge";
import { CONTENT_TYPE_LABELS, seoScoreTextClass } from "./labels";

/** Reusable read-only detail view for a ContentItem, used from the dashboard, planner and audit table. */
export function ContentDetailDialog({
  item,
  brief,
  authorName,
  open,
  onOpenChange,
}: {
  item: ContentItem | null;
  brief?: ContentBrief;
  authorName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {item && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <ContentStatusBadge status={item.status} />
                <Badge variant="outline">{CONTENT_TYPE_LABELS[item.type]}</Badge>
              </div>
              <DialogTitle>{item.title}</DialogTitle>
              <DialogDescription className="truncate">{item.targetUrl}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Field label="Primary keyword" value={item.primaryKeyword} />
                <Field label="Search intent">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                      INTENT_BADGE_CLASS[item.searchIntent],
                    )}
                  >
                    {INTENT_LABELS[item.searchIntent]}
                  </span>
                </Field>
                <Field label="Author">
                  <span className="flex items-center gap-1.5">
                    <Avatar size="sm">
                      <AvatarFallback>{authorName ? initials(authorName) : "—"}</AvatarFallback>
                    </Avatar>
                    {authorName ?? "Unassigned"}
                  </span>
                </Field>
                <Field label="SEO score">
                  <span className={cn("font-semibold tabular-nums", seoScoreTextClass(item.seoScore))}>
                    {item.seoScore ?? "—"}
                  </span>
                </Field>
                <Field label="Word count" value={item.wordCount ? item.wordCount.toLocaleString() : "—"} />
                <Field label="Last updated" value={formatDate(item.updatedAt)} />
                {item.dueDate && <Field label="Due date" value={formatDate(item.dueDate)} />}
                {item.publishedAt && <Field label="Published" value={formatDate(item.publishedAt)} />}
              </div>

              {item.secondaryKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Secondary keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.secondaryKeywords.map((kw) => (
                      <Badge key={kw} variant="secondary">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {brief && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Sparkles className="size-3.5" /> Brief highlights
                  </p>
                  <p className="text-sm">{brief.suggestedMetaDescription}</p>
                  <p className="text-xs text-muted-foreground">
                    Tone: <span className="font-medium text-foreground">{brief.tone}</span> · Audience:{" "}
                    <span className="font-medium text-foreground">{brief.audience}</span>
                  </p>
                  {brief.subtopics.length > 0 && (
                    <ul className="ml-4 list-disc space-y-0.5 text-xs text-muted-foreground">
                      {brief.subtopics.slice(0, 4).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" size="sm" render={<Link href={`/content/writer?site=${item.websiteId}`} />}>
                Open in AI Writer
              </Button>
              <Button variant="outline" size="sm" render={<a href={item.targetUrl} target="_blank" rel="noreferrer" />}>
                <ExternalLink /> View URL
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium text-foreground">{children ?? value}</div>
    </div>
  );
}
