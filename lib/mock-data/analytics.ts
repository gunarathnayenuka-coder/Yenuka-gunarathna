import type { GA4LandingPage, GA4Summary, GSCPageRow, GSCQueryRow, GSCSummary, TrafficChangeInsight, TrendDirection } from "@/types";
import { pick, pickMany, randFloat, randInt, rngFor, type Rng } from "./rng";
import { getKeywordsByWebsite } from "./keywords";
import { getPagesByWebsite, getTrafficHistory, getWebsiteById, type TrafficHistoryPoint } from "./websites";

function clampNum(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Percentage change between two totals, rounded to one decimal. */
function pctChange(before: number, after: number): number {
  if (before <= 0) return after > 0 ? 100 : 0;
  return round1(((after - before) / before) * 100);
}

/** Classic SEO click-through-rate curve by average ranking position, as a percentage. */
function ctrForPosition(rng: Rng, position: number): number {
  if (position <= 1) return randFloat(rng, 25, 38, 2);
  if (position <= 3) return randFloat(rng, 12, 22, 2);
  if (position <= 5) return randFloat(rng, 6, 12, 2);
  if (position <= 10) return randFloat(rng, 2, 6, 2);
  if (position <= 20) return randFloat(rng, 0.5, 2.2, 2);
  return randFloat(rng, 0.1, 0.9, 2);
}

/** Signed clicks change bucketed by the keyword's existing Keywords-module trend, so the two modules never disagree. */
function clicksChangeForTrend(rng: Rng, trend: TrendDirection): number {
  switch (trend) {
    case "up":
      return randFloat(rng, 8, 45, 1);
    case "down":
      return randFloat(rng, -40, -5, 1);
    case "new":
      return randFloat(rng, 50, 120, 1);
    case "lost":
      return randFloat(rng, -90, -60, 1);
    default:
      return randFloat(rng, -4, 4, 1);
  }
}

/** Signed average-position change (negative = improved / smaller rank number) bucketed by trend. */
function positionChangeForTrend(rng: Rng, trend: TrendDirection): number {
  switch (trend) {
    case "up":
      return randFloat(rng, -8, -1, 1);
    case "down":
      return randFloat(rng, 1, 8, 1);
    case "new":
      return randFloat(rng, -15, -3, 1);
    case "lost":
      return randFloat(rng, 15, 40, 1);
    default:
      return randFloat(rng, -1, 1, 1);
  }
}

/** Derives a 12-week clicks+impressions series from the site's existing organic-traffic curve, so it never contradicts it. */
function buildClicksSeries(rng: Rng, trafficHistory: TrafficHistoryPoint[]): GSCSummary["clicksSeries"] {
  const clicksRatio = randFloat(rng, 0.55, 0.85, 2);
  const baseCtr = randFloat(rng, 2.5, 7.5, 2) / 100;

  return trafficHistory.map((point) => {
    const clicks = Math.max(5, Math.round(point.organicTraffic * clicksRatio * randFloat(rng, 0.92, 1.08, 3)));
    const impressions = Math.max(clicks * 4, Math.round(clicks / (baseCtr * randFloat(rng, 0.9, 1.1, 3))));
    return { date: point.date, clicks, impressions };
  });
}

export function getGSCSummary(websiteId: string): GSCSummary {
  const rng = rngFor(`gsc-summary-${websiteId}`);
  const website = getWebsiteById(websiteId);
  const clicksSeries = buildClicksSeries(rng, getTrafficHistory(websiteId));

  const firstPeriod = clicksSeries.slice(0, 4);
  const lastPeriod = clicksSeries.slice(-4);
  const clicksBefore = firstPeriod.reduce((sum, p) => sum + p.clicks, 0);
  const clicksAfter = lastPeriod.reduce((sum, p) => sum + p.clicks, 0);
  const impressionsBefore = firstPeriod.reduce((sum, p) => sum + p.impressions, 0);
  const impressionsAfter = lastPeriod.reduce((sum, p) => sum + p.impressions, 0);

  const clicksChangePct = pctChange(clicksBefore, clicksAfter);
  const healthScore = website?.seoHealthScore ?? 70;
  const avgPosition = clampNum(randFloat(rng, 8, 30, 1) - (healthScore - 70) / 8, 1, 60);
  const positionChange = round1(-(clicksChangePct / 10) + randFloat(rng, -0.8, 0.8, 2));

  return {
    totalClicks: clicksAfter,
    totalImpressions: impressionsAfter,
    avgCtr: impressionsAfter > 0 ? round1((clicksAfter / impressionsAfter) * 100) : 0,
    avgPosition: round1(avgPosition),
    clicksChangePct,
    impressionsChangePct: pctChange(impressionsBefore, impressionsAfter),
    positionChange,
    clicksSeries,
  };
}

export function getGSCQueries(websiteId: string): GSCQueryRow[] {
  const rng = rngFor(`gsc-queries-${websiteId}`);
  const count = randInt(rng, 15, 25);
  const selected = [...getKeywordsByWebsite(websiteId)].sort((a, b) => b.volume - a.volume).slice(0, count);

  return selected.map((k, i) => {
    const position = k.currentRank ?? randInt(rng, 15, 95);
    const ctr = ctrForPosition(rng, position);
    const impressions = Math.max(20, Math.round(k.volume * randFloat(rng, 0.5, 1.2, 2)));
    const clicks = Math.max(0, Math.round(impressions * (ctr / 100)));

    return {
      id: `${websiteId}_gscq_${i.toString().padStart(3, "0")}`,
      query: k.keyword,
      clicks,
      impressions,
      ctr: round1(ctr),
      position: round1(position),
      clicksChangePct: clicksChangeForTrend(rng, k.trend),
      positionChange: positionChangeForTrend(rng, k.trend),
    };
  });
}

export function getGSCPages(websiteId: string): GSCPageRow[] {
  const rng = rngFor(`gsc-pages-${websiteId}`);
  const pages = getPagesByWebsite(websiteId);
  const count = Math.min(pages.length, randInt(rng, 10, 15));
  const selected = [...pages].sort((a, b) => b.seoScore - a.seoScore).slice(0, count);

  return selected.map((p, i) => {
    const position = clampNum(randFloat(rng, 3, 45, 1) - (p.seoScore - 70) / 6, 1, 90);
    const ctr = ctrForPosition(rng, position);
    const impressions = Math.max(30, Math.round(p.wordCount * randFloat(rng, 3, 9, 2)));
    const clicks = Math.max(0, Math.round(impressions * (ctr / 100)));

    return {
      id: `${websiteId}_gscp_${i.toString().padStart(3, "0")}`,
      url: p.url,
      clicks,
      impressions,
      ctr: round1(ctr),
      position: round1(position),
    };
  });
}

/** Derives a 12-week sessions series from the site's existing organic-traffic curve (organic sessions track it closely; total sessions add other channels on top). */
function buildSessionsSeries(rng: Rng, trafficHistory: TrafficHistoryPoint[]): GA4Summary["sessionsSeries"] {
  const organicShare = randFloat(rng, 0.45, 0.75, 2);

  return trafficHistory.map((point) => {
    const organicSessions = Math.max(10, Math.round(point.organicTraffic * randFloat(rng, 0.94, 1.06, 3)));
    const sessions = Math.max(organicSessions, Math.round(organicSessions / organicShare));
    return { date: point.date, sessions, organicSessions };
  });
}

export function getGA4Summary(websiteId: string): GA4Summary {
  const rng = rngFor(`ga4-summary-${websiteId}`);
  const sessionsSeries = buildSessionsSeries(rng, getTrafficHistory(websiteId));

  const firstPeriod = sessionsSeries.slice(0, 4);
  const lastPeriod = sessionsSeries.slice(-4);
  const sessionsBefore = firstPeriod.reduce((sum, p) => sum + p.sessions, 0);
  const sessionsAfter = lastPeriod.reduce((sum, p) => sum + p.sessions, 0);
  const organicBefore = firstPeriod.reduce((sum, p) => sum + p.organicSessions, 0);
  const organicAfter = lastPeriod.reduce((sum, p) => sum + p.organicSessions, 0);

  const usersRatio = randFloat(rng, 0.72, 0.9, 2);
  const users = Math.round(sessionsAfter * usersRatio);
  const usersBefore = Math.round(sessionsBefore * usersRatio);

  const conversionRate = randFloat(rng, 1.2, 6.5, 2) / 100;
  const conversions = Math.max(1, Math.round(sessionsAfter * conversionRate));
  const conversionsBefore = Math.max(1, Math.round(sessionsBefore * conversionRate * randFloat(rng, 0.85, 1.15, 2)));

  return {
    users,
    usersChangePct: pctChange(usersBefore, users),
    sessions: sessionsAfter,
    sessionsChangePct: pctChange(sessionsBefore, sessionsAfter),
    organicSessions: organicAfter,
    organicSessionsChangePct: pctChange(organicBefore, organicAfter),
    conversions,
    conversionsChangePct: pctChange(conversionsBefore, conversions),
    engagementRate: randFloat(rng, 42, 78, 1),
    avgSessionDurationSec: randInt(rng, 45, 320),
    sessionsSeries,
  };
}

export function getGA4LandingPages(websiteId: string): GA4LandingPage[] {
  const rng = rngFor(`ga4-landing-${websiteId}`);
  const pages = getPagesByWebsite(websiteId);
  const count = Math.min(pages.length, randInt(rng, 8, 12));
  const selected = [...pages].sort((a, b) => b.seoScore - a.seoScore).slice(0, count);

  return selected.map((p, i) => {
    const sessions = Math.max(15, Math.round(p.wordCount * randFloat(rng, 2, 6, 2)));
    const organicSessions = Math.round(sessions * randFloat(rng, 0.4, 0.85, 2));
    const conversions = Math.round(sessions * (randFloat(rng, 0.8, 7, 2) / 100));
    const engagementRate = clampNum(randFloat(rng, 35, 85, 1) + (p.seoScore - 70) / 5, 20, 95);

    return {
      id: `${websiteId}_ga4lp_${i.toString().padStart(3, "0")}`,
      url: p.url,
      sessions,
      organicSessions,
      conversions,
      engagementRate: round1(engagementRate),
      changePct: randFloat(rng, -35, 50, 1),
    };
  });
}

const UP_REASONS = [
  "New content targeting long-tail keywords started ranking on page 1.",
  "Several tracked keywords moved into the top 10 over the last few weeks.",
  "A recent batch of backlinks from relevant referring domains boosted authority.",
  "Core Web Vitals improvements on key landing pages lifted rankings.",
  "Seasonal demand increased search volume for core service keywords.",
  "Local map pack visibility improved, driving more click-throughs from nearby searches.",
];

const DOWN_REASONS = [
  "A handful of previously top-10 keywords slipped after a competitor content refresh.",
  "A recent search algorithm update appears to have affected thinner content pages.",
  "Technical issues (slower load times or crawl errors) were detected on key landing pages.",
  "Seasonal demand for core service keywords has softened compared to last month.",
  "Several backlinks from referring domains were lost, reducing overall authority.",
  "A search intent mismatch on high-traffic pages is lowering click-through rate.",
];

const UP_ACTIONS = [
  "Double down on the content and pages driving the gains — expand supporting content around them.",
  "Build additional internal links to the newly-ranking pages to consolidate their position.",
  "Keep map pack listings and review responses up to date to sustain local visibility.",
];

const DOWN_ACTIONS = [
  "Run a fresh technical audit to rule out crawl or Core Web Vitals regressions.",
  "Refresh and expand content on the pages that lost ranking to re-establish relevance.",
  "Prioritize link-building outreach to recover lost referring domains.",
];

/** One natural-language "why did traffic change" insight, direction-matched to the website's own organicTrafficChangePct. */
export function getTrafficChangeInsight(websiteId: string): TrafficChangeInsight {
  const rng = rngFor(`traffic-insight-${websiteId}`);
  const changePct = getWebsiteById(websiteId)?.organicTrafficChangePct ?? 0;
  const direction: "up" | "down" = changePct >= 0 ? "up" : "down";
  const reasons = pickMany(rng, direction === "up" ? UP_REASONS : DOWN_REASONS, randInt(rng, 2, 3));
  const recommendedAction = pick(rng, direction === "up" ? UP_ACTIONS : DOWN_ACTIONS);
  const emoji = direction === "up" ? "📈" : "📉";
  const verb = direction === "up" ? "increased" : "decreased";

  return {
    id: `${websiteId}_traffic_insight`,
    headline: `${emoji} Organic traffic ${verb} ${Math.abs(changePct).toFixed(1)}% over the last 12 weeks.`,
    changePct,
    direction,
    reasons,
    recommendedAction,
  };
}
