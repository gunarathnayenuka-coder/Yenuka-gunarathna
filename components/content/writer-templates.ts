import type { ContentType, SearchIntent } from "@/types";
import { CONTENT_TYPE_LABELS, type Tone } from "./labels";

/**
 * Pure, deterministic template builders for the AI Writer's placeholder output.
 * None of this calls a real model — every button just assembles topically-flavored
 * static copy from the current form inputs, per the product spec for this module.
 */
export interface WriterContext {
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  tone: Tone;
  audience: string;
  contentType: ContentType;
  targetWords: number;
  internalLinkSuggestions: string[];
}

export function titleCase(input: string): string {
  return input.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function parseSecondaryKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function cycleAt(items: string[], index: number): string {
  return items[index % items.length];
}

export function buildOutline(ctx: WriterContext): string {
  const kw = titleCase(ctx.primaryKeyword);
  const secondary = ctx.secondaryKeywords.length ? titleCase(ctx.secondaryKeywords[0]) : kw;
  return [
    `# ${kw}: The Complete Guide`,
    "",
    "## Introduction",
    `- Hook readers searching for "${ctx.primaryKeyword}"`,
    `- Preview what this ${CONTENT_TYPE_LABELS[ctx.contentType].toLowerCase()} covers`,
    "",
    `## What Is ${kw}?`,
    `- Definition and why it matters${ctx.audience ? ` for ${ctx.audience}` : ""}`,
    "",
    `## Key Benefits of ${kw}`,
    "- Benefit one",
    "- Benefit two",
    "- Benefit three",
    "",
    `## ${secondary}`,
    "- Supporting subtopic drawn from keyword research",
    "",
    `## How to Choose the Right ${kw}`,
    "- Criteria checklist",
    "- What to avoid",
    "",
    "## Frequently Asked Questions",
    `- What does ${ctx.primaryKeyword} cost?`,
    `- How long does ${ctx.primaryKeyword} take?`,
    `- Is ${ctx.primaryKeyword} worth it?`,
    "",
    "## Conclusion & Call to Action",
    "- Summarize key points",
    "- Invite the reader to take the next step",
  ].join("\n");
}

export function buildBriefText(ctx: WriterContext): string {
  const kw = ctx.primaryKeyword;
  return [
    `CONTENT BRIEF — ${titleCase(kw)}`,
    "",
    `Target keyword: ${kw}`,
    `Secondary keywords: ${ctx.secondaryKeywords.length ? ctx.secondaryKeywords.join(", ") : "—"}`,
    `Search intent: ${ctx.searchIntent}`,
    `Tone: ${ctx.tone}`,
    `Audience: ${ctx.audience || "General readers researching this topic"}`,
    `Target length: ~${ctx.targetWords} words`,
    "",
    "Subtopics to cover:",
    `- What is ${kw}?`,
    `- Key benefits of ${kw}`,
    `- How much does ${kw} cost?`,
    `- How to choose the right ${kw} provider`,
    "- Common mistakes to avoid",
    "",
    "Questions to answer:",
    `- What does ${kw} typically cost?`,
    `- How long does ${kw} take?`,
    `- Is ${kw} worth it?`,
    "",
    "Suggested meta description:",
    `Discover everything you need to know about ${kw} — practical advice, costs, and expert tips. Updated for 2026.`,
  ].join("\n");
}

const OPENING_SENTENCES: Record<SearchIntent, (kw: string) => string> = {
  informational: (kw) => `If you've been researching ${kw}, you're not alone — it's one of the questions we hear most from customers.`,
  navigational: (kw) => `Looking for the right place to learn about ${kw}? Here's what you need to know.`,
  commercial: (kw) => `Comparing your options for ${kw}? This guide breaks down what actually matters before you decide.`,
  transactional: (kw) => `Ready to get started with ${kw}? Here's everything you need to know before you book.`,
};

function draftSections(ctx: WriterContext): string[] {
  const kw = ctx.primaryKeyword;
  const Kw = titleCase(kw);
  const audience = ctx.audience || "homeowners and businesses like yours";
  const secondary = ctx.secondaryKeywords.length ? ctx.secondaryKeywords : [kw];

  return [
    `# ${Kw}: A Practical Guide`,
    `${OPENING_SENTENCES[ctx.searchIntent](kw)} In this ${CONTENT_TYPE_LABELS[ctx.contentType].toLowerCase()}, we'll walk through exactly what ${kw} involves, what it typically costs, and how to choose the right option for ${audience}.`,
    `## What Is ${Kw}?\n\nAt its core, ${kw} is about solving a specific, recurring problem well — reliably, affordably, and without surprises. Most people start searching for "${kw}" after running into an issue they can't easily fix themselves, or when they're comparing providers ahead of a bigger decision.`,
    `## Key Benefits of ${Kw}\n\nDone well, ${kw} pays for itself. Customers typically see three things improve: fewer repeat problems, more predictable costs, and less time spent managing the issue themselves. It also tends to compound — the earlier you address it properly, the less it costs to maintain over time.`,
    `## ${titleCase(cycleAt(secondary, 0))}\n\nOne of the most common follow-up questions is about ${cycleAt(secondary, 0)}. Pricing varies by scope and location, but it's worth getting at least two or three quotes before committing — and asking each provider to explain exactly what's included.`,
    `## How to Choose the Right Provider\n\nNot all providers are equal. Look for clear, itemized pricing, verifiable reviews, and a straightforward process for asking questions before you commit. A provider that's evasive about timelines or costs upfront is usually a sign to keep looking.`,
    `## Frequently Asked Questions\n\n**Is ${kw} worth it?** For most ${audience}, yes — especially when weighed against the cost of letting the underlying issue continue unaddressed.\n\n**How do I get started?** Reach out for a free consultation — we'll walk you through your options with no obligation.`,
    `## Conclusion\n\n${Kw} doesn't have to be complicated. With the right information and the right partner, you can make a confident decision and get the results you're looking for. Ready to take the next step? Get in touch and we'll help you find the right fit.`,
  ];
}

export function buildDraft(ctx: WriterContext): string {
  const base = draftSections(ctx).join("\n\n");
  const secondary = ctx.secondaryKeywords.length ? ctx.secondaryKeywords : [ctx.primaryKeyword];
  const extras = [
    `It's also worth budgeting for ongoing upkeep rather than treating ${ctx.primaryKeyword} as a one-time expense — a little regular attention goes a long way toward avoiding bigger costs later.`,
    "Local requirements and typical practices can vary by area, so it's worth confirming the specifics with a licensed provider near you before committing to anything.",
    "Customer reviews are one of the most reliable signals of consistent quality — look for patterns across many recent reviews rather than a single glowing (or scathing) one.",
    `Many ${ctx.audience || "customers"} also ask about ${cycleAt(secondary, 1)} — it's closely related and worth researching alongside ${ctx.primaryKeyword} itself.`,
    `Pricing for ${ctx.primaryKeyword} typically depends on scope, timeline, and location, so a detailed, itemized quote is always worth requesting up front.`,
    "A good provider will walk you through the process step by step, set realistic expectations, and be upfront about anything that could affect cost or timeline.",
    `If you're comparing ${cycleAt(secondary, 2)} against other options, weigh not just price but responsiveness, guarantees, and how clearly the provider communicates.`,
    "Ultimately, the right choice comes down to matching your specific needs with a provider who has a proven track record and transparent pricing.",
  ];

  let text = base;
  let i = 0;
  while (wordCount(text) < ctx.targetWords * 0.92 && i < 200) {
    text += `\n\n${extras[i % extras.length]}`;
    i++;
  }
  return text;
}

export function buildOptimized(current: string, ctx: WriterContext): string {
  const base = current.trim() ? current : buildDraft(ctx);
  const intro = `> Optimized: "${titleCase(ctx.primaryKeyword)}" now appears in the opening sentence, a heading, and naturally throughout the body.\n\n`;
  const closing = `\n\n---\nSEO notes: primary keyword "${ctx.primaryKeyword}" reinforced${ctx.secondaryKeywords.length ? ` alongside ${ctx.secondaryKeywords.slice(0, 3).join(", ")}` : ""}. Consider adding one more H2 targeting a long-tail variation.`;
  return `${intro}${base}${closing}`;
}

export function buildImproved(current: string, ctx: WriterContext): string {
  const base = current.trim() ? current : buildDraft(ctx);
  return `${base}\n\n---\nReadability pass: shortened long sentences, added transition phrases between sections, and simplified jargon for ${ctx.audience || "a general audience"}.`;
}

export function buildWithInternalLinks(current: string, ctx: WriterContext): string {
  const base = current.trim() ? current : buildDraft(ctx);
  const links = ctx.internalLinkSuggestions.slice(0, 5);
  if (links.length === 0) return `${base}\n\n---\nNo other indexed pages were found to link to yet.`;
  const list = links.map((url) => `- ${url}`).join("\n");
  return `${base}\n\n---\nSuggested internal links:\n${list}`;
}

export function buildMetaTitle(ctx: WriterContext): string {
  const kw = titleCase(ctx.primaryKeyword);
  const title = `${kw}: The Complete Guide (2026)`;
  return title.length <= 60 ? title : `${kw} Guide & Tips (2026)`.slice(0, 60);
}

export function buildMetaDescription(ctx: WriterContext): string {
  const kw = ctx.primaryKeyword;
  const desc = `Everything you need to know about ${kw} — costs, benefits, and how to choose the right option${ctx.audience ? ` for ${ctx.audience}` : ""}. Read our full guide.`;
  return desc.length <= 160 ? desc : `${desc.slice(0, 157)}...`;
}
