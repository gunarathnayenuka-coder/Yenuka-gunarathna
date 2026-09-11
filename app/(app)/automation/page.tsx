import { Bot, CalendarClock, Power, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { AutomationTable } from "@/components/automation/automation-table";
import { fetchRunsByRule, listAutomationRules } from "@/lib/services/automation";
import { listWebsites } from "@/lib/services/websites";
import { formatDate } from "@/lib/format";
import { REFERENCE_NOW } from "@/lib/mock-data/rng";
import type { AutomationRun } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function AutomationPage() {
  const [rules, websites] = await Promise.all([listAutomationRules(), listWebsites()]);

  const runsEntries = await Promise.all(rules.map(async (rule) => [rule.id, await fetchRunsByRule(rule.id)] as const));
  const runsByRule: Record<string, AutomationRun[]> = Object.fromEntries(runsEntries);
  const allRuns = runsEntries.flatMap(([, runs]) => runs);

  const enabledCount = rules.filter((r) => r.isEnabled).length;
  const now = new Date(REFERENCE_NOW).getTime();
  const runsToday = allRuns.filter((r) => now - new Date(r.startedAt).getTime() < DAY_MS).length;
  const runsThisWeek = allRuns.filter((r) => now - new Date(r.startedAt).getTime() < 7 * DAY_MS).length;

  const nextUp = rules
    .filter((r): r is typeof r & { nextRunAt: string } => Boolean(r.isEnabled && r.nextRunAt))
    .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime())[0];

  return (
    <>
      <PageHeader
        title="Automation"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Automation" }]}
        description="Scheduled crawls, rank checks, reports, and alerts running in the background across your agency."
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total automations" value={rules.length} icon={Zap} />
          <StatCard label="Enabled" value={enabledCount} icon={Power} hint={`${rules.length - enabledCount} disabled`} />
          <StatCard label="Runs this week" value={runsThisWeek} icon={Bot} hint={`${runsToday} today`} />
          <StatCard
            label="Next run"
            value={nextUp ? formatDate(nextUp.nextRunAt) : "—"}
            icon={CalendarClock}
            hint={nextUp?.name}
          />
        </div>

        <AutomationTable data={rules} runsByRule={runsByRule} websites={websites} />
      </div>
    </>
  );
}
