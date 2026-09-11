import type { AutomationRule, AutomationRun } from "@/types";
import { chance, daysAgo, daysFromNow, randInt, rngFor, type Rng } from "./rng";
import { websites } from "./websites";

interface RuleSeed {
  id: string;
  name: string;
  description: string;
  trigger: AutomationRule["trigger"];
  frequency?: AutomationRule["frequency"];
  scope: AutomationRule["scope"];
  websiteId?: string;
  actions: string[];
  /** Approximate days between runs — shapes lastRunAt/nextRunAt windows and run-history spacing. */
  cadenceDays: number;
}

/** Real, stable website ids for the two per-website alert rules. */
const rankingDropWebsiteId = websites[0].id;
const trafficDropWebsiteId = (websites[1] ?? websites[0]).id;

const RULE_SEEDS: RuleSeed[] = [
  {
    id: "auto_0001",
    name: "Daily SEO crawl",
    description:
      "Crawls every page across all client websites once a day to catch new pages, broken links, and technical regressions early.",
    trigger: "schedule",
    frequency: "daily",
    scope: "all_websites",
    actions: [
      "Crawl all indexed pages",
      "Detect broken links and redirects",
      "Update the page inventory",
      "Flag new technical issues",
    ],
    cadenceDays: 1,
  },
  {
    id: "auto_0002",
    name: "Daily rank tracking",
    description: "Checks search engine rankings for every tracked keyword across all websites once a day.",
    trigger: "schedule",
    frequency: "daily",
    scope: "all_websites",
    actions: ["Check SERP positions for tracked keywords", "Update rank history", "Flag ranking changes of 5+ positions"],
    cadenceDays: 1,
  },
  {
    id: "auto_0003",
    name: "Weekly SEO analysis",
    description: "Runs a full SEO health analysis every week, refreshing scores and surfacing new AI recommendations.",
    trigger: "schedule",
    frequency: "weekly",
    scope: "all_websites",
    actions: [
      "Recalculate SEO health scores",
      "Summarize week-over-week traffic and ranking trends",
      "Generate new AI recommendations",
    ],
    cadenceDays: 7,
  },
  {
    id: "auto_0004",
    name: "Weekly competitor analysis",
    description: "Reviews competitor rankings and content weekly to keep keyword gap and content gap reports current.",
    trigger: "schedule",
    frequency: "weekly",
    scope: "all_websites",
    actions: ["Refresh competitor keyword rankings", "Detect new competitor content", "Update the keyword gap report"],
    cadenceDays: 7,
  },
  {
    id: "auto_0005",
    name: "Monthly client reports",
    description: "Compiles and sends a performance report to each client at the start of every month.",
    trigger: "schedule",
    frequency: "monthly",
    scope: "all_websites",
    actions: ["Compile performance summary", "Generate branded PDF report", "Email report to client stakeholders"],
    cadenceDays: 30,
  },
  {
    id: "auto_0006",
    name: "Ranking drop alert",
    description: "Watches tracked keyword rankings for this website and alerts the team the moment a keyword drops significantly.",
    trigger: "ranking_drop",
    scope: "website",
    websiteId: rankingDropWebsiteId,
    actions: [
      "Monitor tracked keyword positions",
      "Detect drops of 5+ positions",
      "Notify the account manager",
      "Log the incident for review",
    ],
    cadenceDays: 1,
  },
  {
    id: "auto_0007",
    name: "Traffic drop alert",
    description: "Monitors organic traffic for this website and alerts the team when sessions fall sharply versus baseline.",
    trigger: "traffic_drop",
    scope: "website",
    websiteId: trafficDropWebsiteId,
    actions: [
      "Monitor daily organic traffic",
      "Compare against the 7-day baseline",
      "Notify the account manager when traffic falls 15%+",
    ],
    cadenceDays: 1,
  },
  {
    id: "auto_0008",
    name: "New backlink alert",
    description: "Watches referring domains across all websites and flags newly acquired backlinks as they're discovered.",
    trigger: "new_backlink",
    scope: "all_websites",
    actions: ["Monitor referring domains", "Detect newly acquired backlinks", "Notify the SEO team"],
    cadenceDays: 1,
  },
  {
    id: "auto_0009",
    name: "Technical issue alert",
    description: "Scans crawl results across all websites for critical technical issues like server errors and broken schema.",
    trigger: "technical_issue",
    scope: "all_websites",
    actions: ["Monitor crawl results for critical errors", "Detect 4xx/5xx spikes and broken schema", "Notify the SEO team immediately"],
    cadenceDays: 1,
  },
];

/** [min, max] days-from-now window for the next scheduled run, given a frequency. */
function nextRunWindow(frequency: AutomationRule["frequency"]): [number, number] {
  switch (frequency) {
    case "daily":
      return [0, 1];
    case "weekly":
      return [1, 7];
    case "monthly":
      return [1, 30];
    default:
      return [0, 1];
  }
}

export const automationRules: AutomationRule[] = RULE_SEEDS.map((seed) => {
  const rng = rngFor(`automation-${seed.id}`);
  const isEnabled = chance(rng, 0.85);
  const lastRunDaysAgo = randInt(rng, 0, seed.cadenceDays);
  const statusRoll = rng();
  const lastRunStatus: NonNullable<AutomationRule["lastRunStatus"]> =
    statusRoll < 0.78 ? "success" : statusRoll < 0.92 ? "partial" : "failed";
  const [minNext, maxNext] = nextRunWindow(seed.frequency);

  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    trigger: seed.trigger,
    frequency: seed.frequency,
    scope: seed.scope,
    websiteId: seed.websiteId,
    isEnabled,
    lastRunAt: daysAgo(lastRunDaysAgo),
    lastRunStatus,
    // Event-driven rules (no fixed frequency) don't have a predictable "next run".
    nextRunAt: seed.frequency ? daysFromNow(randInt(rng, minNext, maxNext)) : undefined,
    actions: seed.actions,
  };
});

export function getRunsByRule(ruleId: string): AutomationRun[] {
  return automationRuns
    .filter((r) => r.ruleId === ruleId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

type RunOutcome = "success" | "failed";
type RunDetails = { summary: string; itemsProcessed: number };

/** Per-rule, per-outcome summary/itemsProcessed generators for realistic run history. */
const RUN_BUILDERS: Record<string, (outcome: RunOutcome, rng: Rng) => RunDetails> = {
  auto_0001: (outcome, rng) => {
    const pages = randInt(rng, 120, 640);
    if (outcome === "failed") {
      return { summary: "Crawl interrupted — 2 client websites returned repeated timeouts partway through.", itemsProcessed: randInt(rng, 20, 100) };
    }
    const newIssues = randInt(rng, 0, 12);
    return {
      summary: `Crawled ${pages} pages across all client websites; found ${newIssues} new issue${newIssues === 1 ? "" : "s"}.`,
      itemsProcessed: pages,
    };
  },
  auto_0002: (outcome, rng) => {
    const keywords = randInt(rng, 400, 1800);
    return outcome === "success"
      ? {
          summary: `Checked ${keywords} tracked keywords; ${randInt(rng, 3, 22)} moved up, ${randInt(rng, 1, 14)} dropped.`,
          itemsProcessed: keywords,
        }
      : { summary: "Rank check failed for 3 websites — search engine responses were rate-limited.", itemsProcessed: randInt(rng, 100, 400) };
  },
  auto_0003: (outcome, rng) => {
    const sites = randInt(rng, 8, websites.length || 12);
    return outcome === "success"
      ? {
          summary: `Refreshed SEO health scores across ${sites} websites and generated ${randInt(rng, 4, 18)} new AI recommendations.`,
          itemsProcessed: sites,
        }
      : { summary: "Analysis incomplete — score recalculation failed for 2 websites due to missing crawl data.", itemsProcessed: randInt(rng, 2, 8) };
  },
  auto_0004: (outcome, rng) => {
    const competitors = randInt(rng, 6, 24);
    return outcome === "success"
      ? { summary: `Compared ${competitors} competitor profiles; found ${randInt(rng, 2, 9)} new content gaps.`, itemsProcessed: competitors }
      : { summary: "Competitor analysis failed — 1 competitor domain was unreachable during the scan.", itemsProcessed: randInt(rng, 2, 10) };
  },
  auto_0005: (outcome, rng) => {
    const reports = randInt(rng, 8, 20);
    return outcome === "success"
      ? { summary: `Generated and emailed ${reports} client reports.`, itemsProcessed: reports }
      : { summary: "2 client reports failed to send — invalid recipient email on file.", itemsProcessed: randInt(rng, 5, 15) };
  },
  auto_0006: (outcome, rng) => {
    const monitored = randInt(rng, 80, 260);
    if (outcome === "failed") {
      return { summary: "Monitoring check failed — rank data was unavailable for this website today.", itemsProcessed: 0 };
    }
    return chance(rng, 0.35)
      ? { summary: `Detected a ${randInt(rng, 5, 14)}-position drop for a tracked keyword — account manager notified.`, itemsProcessed: monitored }
      : { summary: "No significant ranking drops detected.", itemsProcessed: monitored };
  },
  auto_0007: (outcome, rng) => {
    const sessions = randInt(rng, 500, 5000);
    if (outcome === "failed") {
      return { summary: "Monitoring check failed — analytics data did not sync today.", itemsProcessed: 0 };
    }
    return chance(rng, 0.3)
      ? { summary: `Detected a ${randInt(rng, 12, 28)}% traffic drop vs the 7-day baseline — alert sent.`, itemsProcessed: sessions }
      : { summary: "Organic traffic within normal range — no alert triggered.", itemsProcessed: sessions };
  },
  auto_0008: (outcome, rng) => {
    if (outcome === "failed") {
      return { summary: "Backlink scan failed — the link index provider returned an error.", itemsProcessed: 0 };
    }
    const found = chance(rng, 0.4) ? randInt(rng, 1, 9) : 0;
    return {
      summary: found === 0 ? "No new backlinks detected today." : `${found} new backlink${found === 1 ? "" : "s"} detected from referring domains.`,
      itemsProcessed: found,
    };
  },
  auto_0009: (outcome, rng) => {
    if (outcome === "failed") {
      return { summary: "Scan incomplete — crawl data was unavailable for 1 website.", itemsProcessed: 0 };
    }
    const found = chance(rng, 0.3) ? randInt(rng, 1, 6) : 0;
    return {
      summary:
        found === 0
          ? "No critical issues detected across tracked websites."
          : `Detected ${found} page${found === 1 ? "" : "s"} with critical technical issues — team notified.`,
      itemsProcessed: found,
    };
  },
};

export const automationRuns: AutomationRun[] = automationRules.flatMap((rule) => {
  const rng = rngFor(`automation-runs-${rule.id}`);
  const count = randInt(rng, 4, 8);
  const spacing = rule.frequency === "monthly" ? 30 : rule.frequency === "weekly" ? 7 : 1;
  const jitterMax = spacing > 1 ? Math.floor(spacing / 3) : 0;
  const build = RUN_BUILDERS[rule.id];

  return Array.from({ length: count }, (_, i) => {
    const startedDaysAgo = i * spacing + randInt(rng, 0, jitterMax);
    const outcome: RunOutcome = chance(rng, 0.85) ? "success" : "failed";
    const { summary, itemsProcessed } = build(outcome, rng);

    return {
      id: `${rule.id}_run_${i.toString().padStart(3, "0")}`,
      ruleId: rule.id,
      startedAt: daysAgo(startedDaysAgo),
      // Matches the `crawlRuns` convention in `./websites` for a same-day finish timestamp.
      finishedAt: daysAgo(startedDaysAgo - 0.02),
      status: outcome,
      summary,
      itemsProcessed,
    };
  });
});
