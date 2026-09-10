"use client";

import { useMemo, useState } from "react";
import { cn } from "cn";
import { toast } from "sonner";
import { Info, Loader2, Wand2 } from "lucide-react";
import type { ContentType, SearchIntent } from "@/types";
import { SEARCH_INTENTS } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INTENT_LABELS } from "@/lib/labels";
import { CONTENT_TYPE_LABELS, TARGET_LENGTH_OPTIONS, TONE_OPTIONS, seoScoreTextClass, type TargetLength, type Tone } from "./labels";
import {
  buildBriefText,
  buildDraft,
  buildImproved,
  buildMetaDescription,
  buildMetaTitle,
  buildOptimized,
  buildOutline,
  buildWithInternalLinks,
  parseSecondaryKeywords,
  wordCount,
  type WriterContext,
} from "./writer-templates";

type WriterAction = "outline" | "brief" | "draft" | "optimize" | "improve" | "internal_links" | "meta_title" | "meta_description";

const ACTIONS: WriterAction[] = ["outline", "brief", "draft", "optimize", "improve", "internal_links", "meta_title", "meta_description"];

const ACTION_LABEL: Record<WriterAction, string> = {
  outline: "Generate Outline",
  brief: "Generate Brief",
  draft: "Generate Draft",
  optimize: "Optimize",
  improve: "Improve",
  internal_links: "Add Internal Links",
  meta_title: "Generate Meta Title",
  meta_description: "Generate Meta Description",
};

const TOAST_MESSAGE: Record<WriterAction, string> = {
  outline: "Outline generated.",
  brief: "Content brief generated.",
  draft: "Draft generated — review before publishing.",
  optimize: "Content optimized around your target keyword.",
  improve: "Readability and flow improved.",
  internal_links: "Internal link suggestions added.",
  meta_title: "Meta title generated.",
  meta_description: "Meta description generated.",
};

const CONTENT_TYPES: ContentType[] = ["blog_post", "landing_page", "product_page", "guide", "case_study"];

export function ContentWriterPanel({
  websiteDomain,
  suggestedKeywords,
  internalLinkSuggestions,
}: {
  websiteDomain: string;
  suggestedKeywords: string[];
  internalLinkSuggestions: string[];
}) {
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywordsInput, setSecondaryKeywordsInput] = useState("");
  const [searchIntent, setSearchIntent] = useState<SearchIntent>("informational");
  const [tone, setTone] = useState<Tone>("Professional");
  const [audience, setAudience] = useState("");
  const [targetLength, setTargetLength] = useState<TargetLength>("medium");
  const [contentType, setContentType] = useState<ContentType>("blog_post");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [loadingAction, setLoadingAction] = useState<WriterAction | null>(null);

  const targetWords = TARGET_LENGTH_OPTIONS.find((o) => o.value === targetLength)?.words ?? 1200;
  const words = useMemo(() => wordCount(content), [content]);
  const readability = useMemo(() => readabilityHint(content), [content]);
  const seoHint = useMemo(
    () => estimateSeoScore({ content, primaryKeyword, metaTitle, metaDescription, targetWords }),
    [content, primaryKeyword, metaTitle, metaDescription, targetWords],
  );

  async function handleAction(action: WriterAction) {
    if (!primaryKeyword.trim()) {
      toast.error("Enter a primary keyword first.");
      return;
    }
    setLoadingAction(action);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const ctx: WriterContext = {
      primaryKeyword: primaryKeyword.trim(),
      secondaryKeywords: parseSecondaryKeywords(secondaryKeywordsInput),
      searchIntent,
      tone,
      audience: audience.trim(),
      contentType,
      targetWords,
      internalLinkSuggestions,
    };

    switch (action) {
      case "outline":
        setContent(buildOutline(ctx));
        break;
      case "brief":
        setContent(buildBriefText(ctx));
        break;
      case "draft":
        setContent(buildDraft(ctx));
        break;
      case "optimize":
        setContent((prev) => buildOptimized(prev, ctx));
        break;
      case "improve":
        setContent((prev) => buildImproved(prev, ctx));
        break;
      case "internal_links":
        setContent((prev) => buildWithInternalLinks(prev, ctx));
        break;
      case "meta_title":
        setMetaTitle(buildMetaTitle(ctx));
        break;
      case "meta_description":
        setMetaDescription(buildMetaDescription(ctx));
        break;
    }

    setLoadingAction(null);
    toast.success(TOAST_MESSAGE[action]);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr] lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Brief inputs</CardTitle>
          <CardDescription>Tell the writer what to generate for {websiteDomain}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="primary-keyword">Primary keyword</Label>
            <Input
              id="primary-keyword"
              placeholder="e.g. emergency plumber near me"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
            />
            {suggestedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestedKeywords.slice(0, 6).map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setPrimaryKeyword(kw)}
                    className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="secondary-keywords">Secondary keywords</Label>
            <Input
              id="secondary-keywords"
              placeholder="comma, separated, keywords"
              value={secondaryKeywordsInput}
              onChange={(e) => setSecondaryKeywordsInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="search-intent">Search intent</Label>
              <Select value={searchIntent} onValueChange={(v) => v && setSearchIntent(v as SearchIntent)}>
                <SelectTrigger id="search-intent" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEARCH_INTENTS.map((intent) => (
                    <SelectItem key={intent} value={intent}>
                      {INTENT_LABELS[intent]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => v && setTone(v as Tone)}>
                <SelectTrigger id="tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="audience">Audience</Label>
            <Input id="audience" placeholder="e.g. homeowners in Colombo" value={audience} onChange={(e) => setAudience(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="target-length">Target length</Label>
              <Select value={targetLength} onValueChange={(v) => v && setTargetLength(v as TargetLength)}>
                <SelectTrigger id="target-length" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_LENGTH_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content-type">Content type</Label>
              <Select value={contentType} onValueChange={(v) => v && setContentType(v as ContentType)}>
                <SelectTrigger id="content-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {CONTENT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t pt-4">
            {ACTIONS.map((action) => (
              <Button
                key={action}
                type="button"
                variant={action === "draft" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                disabled={loadingAction !== null}
                onClick={() => handleAction(action)}
              >
                {loadingAction === action ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {ACTION_LABEL[action]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="meta-title">Meta title</Label>
                <span className="text-xs text-muted-foreground">{metaTitle.length}/60</span>
              </div>
              <Input id="meta-title" placeholder="Generated meta title will appear here" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="meta-description">Meta description</Label>
                <span className="text-xs text-muted-foreground">{metaDescription.length}/160</span>
              </div>
              <Input
                id="meta-description"
                placeholder="Generated meta description will appear here"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>Generated content appears here — edit freely before saving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Generated outlines and drafts will appear here. Enter a primary keyword and choose an action on the left to get started."
              className="min-h-100 font-mono text-sm"
            />
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                Words: <span className="font-medium text-foreground">{words}</span> / ~{targetWords}
              </span>
              <span>
                Readability: <span className="font-medium text-foreground">{readability}</span>
              </span>
              <span>
                SEO score: <span className={cn("font-medium", seoScoreTextClass(seoHint))}>{seoHint}</span>
              </span>
            </div>
            <Alert>
              <Info />
              <AlertDescription>
                AI-generated — review before publishing. Always fact-check and add your own voice before it goes live.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function readabilityHint(text: string): string {
  if (!text.trim()) return "—";
  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const avgWordsPerSentence = wordCount(text) / sentenceCount;
  if (avgWordsPerSentence <= 14) return "Easy to read";
  if (avgWordsPerSentence <= 20) return "Fairly easy";
  if (avgWordsPerSentence <= 26) return "Moderate";
  return "Fairly difficult";
}

function estimateSeoScore({
  content,
  primaryKeyword,
  metaTitle,
  metaDescription,
  targetWords,
}: {
  content: string;
  primaryKeyword: string;
  metaTitle: string;
  metaDescription: string;
  targetWords: number;
}): number {
  if (!content.trim() && !primaryKeyword.trim()) return 0;
  let score = 35;
  const words = wordCount(content);
  if (primaryKeyword.trim() && content.toLowerCase().includes(primaryKeyword.trim().toLowerCase())) score += 20;
  if (metaTitle.trim()) score += 15;
  if (metaDescription.trim()) score += 15;
  if (words >= targetWords * 0.6) score += 10;
  if (words >= targetWords * 0.9) score += 5;
  return Math.min(100, score);
}
