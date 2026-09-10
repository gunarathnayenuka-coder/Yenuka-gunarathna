import type { CoreWebVitalRating, CoreWebVitalsSummary } from "@/types";
import { getPagesByWebsite } from "./websites";
import { randInt, rngFor } from "./rng";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Thresholds per the Core Web Vitals spec: good < 2500ms, poor > 4000ms. */
export function lcpRating(ms: number): CoreWebVitalRating {
  if (ms < 2500) return "good";
  if (ms > 4000) return "poor";
  return "needs_improvement";
}

/** Thresholds per the Core Web Vitals spec: good < 200ms, poor > 500ms. */
export function inpRating(ms: number): CoreWebVitalRating {
  if (ms < 200) return "good";
  if (ms > 500) return "poor";
  return "needs_improvement";
}

/** Thresholds per the Core Web Vitals spec: good < 0.1, poor > 0.25. */
export function clsRating(value: number): CoreWebVitalRating {
  if (value < 0.1) return "good";
  if (value > 0.25) return "poor";
  return "needs_improvement";
}

/**
 * Deterministic per-website Core Web Vitals summary, aggregated from that
 * website's crawled pages rather than invented independently.
 */
export function getCoreWebVitalsSummary(websiteId: string): CoreWebVitalsSummary {
  const rng = rngFor(`performance-${websiteId}`);
  const pages = getPagesByWebsite(websiteId);

  const lcpMs = Math.round(average(pages.map((p) => p.lcpMs)));
  const inpMs = Math.round(average(pages.map((p) => p.inpMs)));
  const cls = Number(average(pages.map((p) => p.cls)).toFixed(2));

  const goodPageCount = pages.filter(
    (p) => lcpRating(p.lcpMs) === "good" && inpRating(p.inpMs) === "good" && clsRating(p.cls) === "good",
  ).length;
  const pctUrlsGood = pages.length > 0 ? Math.round((goodPageCount / pages.length) * 1000) / 10 : 0;

  // Desktop is typically faster and steadier than mobile; derive both scores from
  // how far average load time and Core Web Vitals pass-rate sit from the ideal,
  // then apply a mobile penalty with light seeded jitter for variety across sites.
  const avgLoadTimeMs = average(pages.map((p) => p.loadTimeMs));
  const baseScore = Math.round(100 - avgLoadTimeMs / 45 - (100 - pctUrlsGood) * 0.25);
  const clampedBase = Math.max(15, Math.min(99, baseScore));
  const desktopScore = Math.max(10, Math.min(100, clampedBase + randInt(rng, 4, 12)));
  const mobileScore = Math.max(5, Math.min(100, clampedBase - randInt(rng, 8, 18)));

  return {
    lcpMs,
    lcpRating: lcpRating(lcpMs),
    inpMs,
    inpRating: inpRating(inpMs),
    cls,
    clsRating: clsRating(cls),
    mobileScore,
    desktopScore,
    pctUrlsGood,
  };
}
