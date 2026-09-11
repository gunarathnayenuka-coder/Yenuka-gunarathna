import type { Report, ReportSchedule, ReportType } from "@/types";
import { chance, daysAgo, daysFromNow, makeId, pick, randInt, REFERENCE_NOW, rngFor, type Rng } from "./rng";
import { domainFor } from "./constants";
import { clients } from "./clients";
import { getWebsitesByClient } from "./websites";

const REPORT_TYPES: ReportType[] = [
  "weekly_seo",
  "monthly_seo",
  "technical_seo",
  "keyword",
  "content",
  "competitor",
];

/** Short, title-friendly label for each report type (kept local to mock-data generation). */
const TYPE_TITLE_CORE: Record<ReportType, string> = {
  weekly_seo: "Weekly SEO",
  monthly_seo: "Monthly SEO",
  technical_seo: "Technical SEO",
  keyword: "Keyword",
  content: "Content",
  competitor: "Competitor",
};

/** Weighted so most historical reports have actually gone out, with a few still in progress. */
const STATUS_POOL: Report["status"][] = [
  "generated",
  "generated",
  "generated",
  "sent",
  "sent",
  "sent",
  "sent",
  "draft",
  "scheduled",
];

/** Explicit per-client report counts (by client index) so the total stays predictably within 15-25. */
const REPORTS_PER_CLIENT_INDEX = [2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_ABBR[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Calendar-month boundaries `offsetMonths` months from the reference "now" (negative = past, positive = future). */
function monthRange(offsetMonths: number): { start: string; end: string; label: string } {
  const ref = new Date(REFERENCE_NOW);
  const y = ref.getUTCFullYear();
  const m = ref.getUTCMonth();
  const start = new Date(Date.UTC(y, m + offsetMonths, 1));
  const end = new Date(Date.UTC(y, m + offsetMonths + 1, 0, 23, 59, 59));
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: `${MONTH_NAMES[start.getUTCMonth()]} ${start.getUTCFullYear()}`,
  };
}

/** 1-2 sentence, type-flavored summary for a generated/sent report. */
function buildSummary(type: ReportType, rng: Rng): string {
  switch (type) {
    case "weekly_seo": {
      const pct = randInt(rng, 2, 22);
      const trend = chance(rng, 0.75) ? "up" : "down";
      const score = randInt(rng, 58, 96);
      const issues = randInt(rng, 0, 6);
      return `Organic traffic was ${trend} ${pct}% week-over-week, with the SEO health score holding at ${score}/100. ${issues} new issue${issues === 1 ? "" : "s"} were flagged during this week's crawl.`;
    }
    case "monthly_seo": {
      const pct = randInt(rng, 3, 38);
      const trend = chance(rng, 0.78) ? "up" : "down";
      const newTop10 = randInt(rng, 2, 18);
      const score = randInt(rng, 58, 96);
      return `Organic traffic was ${trend} ${pct}% this month and ${newTop10} keyword${newTop10 === 1 ? "" : "s"} moved into the top 10. Overall SEO health is now ${score}/100.`;
    }
    case "technical_seo": {
      const resolved = randInt(rng, 4, 22);
      const critical = randInt(rng, 0, 4);
      const score = randInt(rng, 60, 97);
      return `${resolved} technical issues were resolved this period, including ${critical} critical fix${critical === 1 ? "" : "es"}. Site-wide crawl health is now ${score}/100.`;
    }
    case "keyword": {
      const newTop10 = randInt(rng, 3, 20);
      const tracked = randInt(rng, 40, 320);
      const oppScore = randInt(rng, 45, 88);
      return `${newTop10} keyword${newTop10 === 1 ? "" : "s"} moved into the top 10 this period, out of ${tracked} keywords now being tracked. Average opportunity score across the priority list is ${oppScore}.`;
    }
    case "content": {
      const published = randInt(rng, 1, 6);
      const pct = randInt(rng, 4, 30);
      return `${published} new piece${published === 1 ? "" : "s"} of content ${published === 1 ? "was" : "were"} published this period, contributing to a ${pct}% lift in traffic to blog and resource pages.`;
    }
    case "competitor": {
      const gapClosed = randInt(rng, 2, 14);
      const newGaps = randInt(rng, 1, 8);
      return `Closed the keyword gap with top competitors by ${gapClosed} keyword${gapClosed === 1 ? "" : "s"} and identified ${newGaps} new content opportunit${newGaps === 1 ? "y" : "ies"} to pursue next.`;
    }
    default:
      return "Performance held steady across the tracked metrics this period.";
  }
}

export const reports: Report[] = clients.flatMap((client, ci) => {
  const rng = rngFor(`reports-${client.id}`);
  const count = REPORTS_PER_CLIENT_INDEX[ci] ?? 1;
  const clientWebsites = getWebsitesByClient(client.id);

  return Array.from({ length: count }, (_, i) => {
    const type = pick(rng, REPORT_TYPES);
    const status = pick(rng, STATUS_POOL);
    const website = clientWebsites.length > 0 ? pick(rng, clientWebsites) : undefined;
    const websiteId = website?.id ?? client.primaryWebsiteId;
    const isWeekly = type === "weekly_seo";
    const isUpcoming = status === "scheduled";

    let from: string;
    let to: string;
    let title: string;

    if (isWeekly) {
      const weeksOffset = isUpcoming ? randInt(rng, 1, 3) : randInt(rng, 0, 9);
      const weekEnd = isUpcoming ? daysFromNow(weeksOffset * 7) : daysAgo(weeksOffset * 7);
      const weekStart = isUpcoming ? daysFromNow(weeksOffset * 7 - 6) : daysAgo(weeksOffset * 7 + 6);
      from = weekStart;
      to = weekEnd;
      title = `Week of ${shortLabel(from)}–${shortLabel(to)} ${TYPE_TITLE_CORE[type]} Report — ${client.name}`;
    } else {
      const monthsOffset = isUpcoming ? randInt(rng, 1, 2) : -randInt(rng, 0, 5);
      const range = monthRange(monthsOffset);
      from = range.start;
      to = range.end;
      title = `${range.label} ${TYPE_TITLE_CORE[type]} Report — ${client.name}`;
    }

    let generatedAt: string | undefined;
    let sentAt: string | undefined;
    let summary: string | undefined;

    if (status === "generated" || status === "sent") {
      const refTime = new Date(REFERENCE_NOW).getTime();
      const toTime = new Date(to).getTime();
      const daysAgoOfTo = Math.max(0, Math.round((refTime - toTime) / 86_400_000));
      const generatedDaysAgo = Math.max(0, daysAgoOfTo - randInt(rng, 1, 5));
      generatedAt = daysAgo(generatedDaysAgo);
      if (status === "sent") {
        const sentDaysAgo = Math.max(0, generatedDaysAgo - randInt(rng, 0, 2));
        sentAt = daysAgo(sentDaysAgo);
      }
      summary = buildSummary(type, rng);
    }

    return {
      id: makeId(`report-${ci}`, i + 1),
      clientId: client.id,
      websiteId,
      type,
      title,
      dateRange: { from, to },
      status,
      generatedAt,
      sentAt,
      summary,
    } satisfies Report;
  });
});

export function getReportsByClient(clientId: string): Report[] {
  return reports
    .filter((r) => r.clientId === clientId)
    .sort((a, b) => new Date(b.dateRange.to).getTime() - new Date(a.dateRange.to).getTime());
}

const SCHEDULE_EXTRA_RECIPIENT_LOCALS = ["marketing", "growth", "ceo", "operations"] as const;

export const reportSchedules: ReportSchedule[] = clients.flatMap((client, ci) => {
  const rng = rngFor(`report-schedule-${client.id}`);
  if (!chance(rng, 0.65)) return [];

  const count = chance(rng, 0.35) ? 2 : 1;
  const domain = domainFor(client.name);

  return Array.from({ length: count }, (_, i) => {
    const frequency: ReportSchedule["frequency"] = i === 0 ? pick(rng, ["weekly", "monthly"] as const) : "monthly";
    const type = pick(rng, REPORT_TYPES);
    const recipients = chance(rng, 0.5)
      ? [client.contactEmail]
      : [client.contactEmail, `${pick(rng, SCHEDULE_EXTRA_RECIPIENT_LOCALS)}@${domain}`];
    const isEnabled = chance(rng, 0.85);
    const nextSendAt = frequency === "weekly" ? daysFromNow(randInt(rng, 1, 7)) : daysFromNow(randInt(rng, 1, 30));

    return {
      id: makeId(`report-schedule-${ci}`, i + 1),
      clientId: client.id,
      type,
      frequency,
      recipients,
      nextSendAt,
      isEnabled,
    } satisfies ReportSchedule;
  });
});

export function getSchedulesByClient(clientId: string): ReportSchedule[] {
  return reportSchedules.filter((s) => s.clientId === clientId);
}
