import type { Severity, SEOIssue, SEOIssueCategory, SEOScoreBreakdown, SEOScoreHistoryPoint } from "@/types";
import { chance, daysAgo, pick, randInt, rngFor } from "./rng";
import { websites } from "./websites";
import { getPagesByWebsite } from "./websites";
import { users } from "./organizations";

interface IssueTemplate {
  category: SEOIssueCategory;
  title: string;
  description: string;
  recommendation: string;
  severity: Severity;
}

const ISSUE_TEMPLATES: IssueTemplate[] = [
  {
    category: "technical",
    title: "Broken internal links detected",
    description: "Several internal links point to pages that return a 404 status code, wasting crawl budget and hurting user experience.",
    recommendation: "Update or remove the broken links, and add 301 redirects for any pages that have permanently moved.",
    severity: "high",
  },
  {
    category: "technical",
    title: "Redirect chain longer than 2 hops",
    description: "Some URLs redirect through multiple hops before reaching their final destination, slowing crawling and diluting link equity.",
    recommendation: "Point the original link directly to the final destination URL.",
    severity: "medium",
  },
  {
    category: "technical",
    title: "XML sitemap contains non-indexable URLs",
    description: "The sitemap references URLs that are noindexed or return non-200 status codes.",
    recommendation: "Remove noindexed and non-200 URLs from the sitemap so search engines only crawl what matters.",
    severity: "medium",
  },
  {
    category: "technical",
    title: "Robots.txt blocking important resources",
    description: "CSS and JavaScript files required for rendering are disallowed in robots.txt, which can affect how Google renders the page.",
    recommendation: "Allow crawling of CSS/JS assets required for rendering.",
    severity: "high",
  },
  {
    category: "on_page",
    title: "Missing meta description",
    description: "This page has no meta description, so Google will auto-generate a snippet that may not match your messaging.",
    recommendation: "Write a compelling, keyword-relevant meta description under 160 characters.",
    severity: "medium",
  },
  {
    category: "on_page",
    title: "Duplicate title tags",
    description: "Multiple pages share the exact same title tag, which confuses search engines about which page to rank.",
    recommendation: "Write a unique, descriptive title for each page that reflects its specific content.",
    severity: "high",
  },
  {
    category: "on_page",
    title: "Missing H1 tag",
    description: "This page does not contain an H1 heading, which helps both users and search engines understand the page topic.",
    recommendation: "Add a single, descriptive H1 that includes the primary target keyword.",
    severity: "medium",
  },
  {
    category: "on_page",
    title: "Multiple H1 tags on one page",
    description: "This page has more than one H1, which can dilute topical signals for search engines.",
    recommendation: "Keep a single H1 and demote additional headings to H2/H3.",
    severity: "low",
  },
  {
    category: "on_page",
    title: "Images missing alt text",
    description: "Several images do not have descriptive alt attributes, hurting accessibility and image search visibility.",
    recommendation: "Add descriptive, keyword-aware alt text to every meaningful image.",
    severity: "low",
  },
  {
    category: "performance",
    title: "Largest Contentful Paint above 2.5s",
    description: "LCP exceeds Google's 'good' threshold on mobile, which can affect rankings and conversion rate.",
    recommendation: "Compress hero images, preload critical assets, and reduce render-blocking resources.",
    severity: "high",
  },
  {
    category: "performance",
    title: "Cumulative Layout Shift above 0.1",
    description: "Visual elements shift during load, creating a poor user experience and failing Core Web Vitals.",
    recommendation: "Reserve space for images/ads and avoid injecting content above existing elements.",
    severity: "medium",
  },
  {
    category: "performance",
    title: "Unoptimized images increasing page weight",
    description: "Several images are served at a much larger size than displayed, increasing load time.",
    recommendation: "Serve responsive, compressed images in modern formats such as WebP or AVIF.",
    severity: "medium",
  },
  {
    category: "schema",
    title: "Missing LocalBusiness schema",
    description: "This page qualifies for LocalBusiness structured data but none is implemented.",
    recommendation: "Add LocalBusiness JSON-LD including name, address, phone, and opening hours.",
    severity: "medium",
  },
  {
    category: "schema",
    title: "FAQ schema markup errors",
    description: "Structured data testing found invalid FAQPage markup that may prevent rich results from appearing.",
    recommendation: "Fix the JSON-LD syntax so each question/answer pair validates correctly.",
    severity: "low",
  },
  {
    category: "internal_linking",
    title: "Orphan pages with no internal links",
    description: "These pages exist on the site but have no internal links pointing to them, making them hard to discover and rank.",
    recommendation: "Add contextual internal links from related, high-authority pages.",
    severity: "high",
  },
  {
    category: "internal_linking",
    title: "Thin internal linking to key service pages",
    description: "High-value service pages receive very few internal links relative to their business importance.",
    recommendation: "Link to priority pages from the homepage, blog posts, and navigation where relevant.",
    severity: "medium",
  },
  {
    category: "mobile",
    title: "Mobile usability: tap targets too small",
    description: "Some buttons and links are too close together for comfortable tapping on mobile devices.",
    recommendation: "Increase spacing and touch target size to at least 48x48px.",
    severity: "low",
  },
  {
    category: "content",
    title: "Thin content with low word count",
    description: "This page has significantly less content than top-ranking competitors for its target keyword.",
    recommendation: "Expand the content to thoroughly cover the topic and target keyword's search intent.",
    severity: "medium",
  },
  {
    category: "content",
    title: "Content not updated in over 12 months",
    description: "This previously high-traffic page has not been refreshed and may be losing relevance and rankings.",
    recommendation: "Update statistics, examples, and recommendations, then republish with a fresh date.",
    severity: "low",
  },
];

function issueStatusFor(rng: ReturnType<typeof rngFor>): SEOIssue["status"] {
  const roll = rng();
  if (roll < 0.45) return "open";
  if (roll < 0.7) return "in_progress";
  if (roll < 0.92) return "resolved";
  return "ignored";
}

export const seoIssues: SEOIssue[] = websites.flatMap((website) => {
  const rng = rngFor(`issues-${website.id}`);
  const pages = getPagesByWebsite(website.id);
  const issueCount = randInt(rng, 10, 22);

  return Array.from({ length: issueCount }, (_, i) => {
    const template = pick(rng, ISSUE_TEMPLATES);
    const page = pages.length > 0 ? pick(rng, pages) : undefined;
    const status = issueStatusFor(rng);
    return {
      id: `${website.id}_issue_${i.toString().padStart(3, "0")}`,
      websiteId: website.id,
      category: template.category,
      title: template.title,
      description: template.description,
      recommendation: template.recommendation,
      severity: template.severity,
      status,
      url: page?.url ?? website.url,
      affectedPages: randInt(rng, 1, 14),
      detectedAt: daysAgo(randInt(rng, 0, 30)),
      assigneeId: chance(rng, 0.6) ? pick(rng, users).id : undefined,
      resolvedAt: status === "resolved" ? daysAgo(randInt(rng, 0, 10)) : undefined,
    };
  });
});

export function getIssuesByWebsite(websiteId: string): SEOIssue[] {
  return seoIssues.filter((issue) => issue.websiteId === websiteId);
}

export function getScoreBreakdown(websiteId: string): SEOScoreBreakdown {
  const rng = rngFor(`score-${websiteId}`);
  const website = websites.find((w) => w.id === websiteId);
  const overall = website?.seoHealthScore ?? randInt(rng, 60, 95);
  const jitter = () => Math.max(20, Math.min(100, overall + randInt(rng, -16, 12)));
  return {
    overall,
    technical: jitter(),
    onPage: jitter(),
    content: jitter(),
    performance: jitter(),
    internalLinking: jitter(),
    schema: jitter(),
    authority: jitter(),
    local: jitter(),
  };
}

export function getScoreHistory(websiteId: string): SEOScoreHistoryPoint[] {
  const rng = rngFor(`score-history-${websiteId}`);
  const website = websites.find((w) => w.id === websiteId);
  const target = website?.seoHealthScore ?? 80;
  let value = Math.max(35, target - randInt(rng, 8, 20));
  return Array.from({ length: 12 }, (_, i) => {
    value = Math.max(30, Math.min(100, value + randInt(rng, -3, 5)));
    return { date: daysAgo((11 - i) * 7), overall: i === 11 ? target : value };
  });
}
