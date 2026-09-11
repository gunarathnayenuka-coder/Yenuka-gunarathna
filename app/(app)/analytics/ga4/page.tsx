import { Gauge, MousePointerClick, Sprout, Target, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, ChartCard } from "@/components/shared";
import { DateRangeSelect } from "@/components/analytics/date-range-select";
import { GA4SessionsChart } from "@/components/analytics/ga4-sessions-chart";
import { GA4LandingPagesTable } from "@/components/analytics/ga4-landing-pages-table";
import { TrafficChangeInsightCard } from "@/components/analytics/traffic-change-insight-card";
import { fetchGA4LandingPages, fetchGA4Summary, fetchTrafficChangeInsight } from "@/lib/services/analytics";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber, formatPercent } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

/** e.g. 185 -> "3m 5s" */
function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds}s`;
}

export default async function GoogleAnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, summary, landingPages, insight] = await Promise.all([
    fetchWebsite(websiteId),
    fetchGA4Summary(websiteId),
    fetchGA4LandingPages(websiteId),
    fetchTrafficChangeInsight(websiteId),
  ]);

  return (
    <>
      <PageHeader
        title="Google Analytics"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Analytics", href: "/analytics/gsc" }, { label: "Google Analytics" }]}
        description={website ? `GA4 performance for ${website.domain}` : "GA4 performance for the current website."}
        actions={<DateRangeSelect />}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Users" value={formatCompactNumber(summary.users)} changePct={summary.usersChangePct} icon={Users} />
          <StatCard label="Sessions" value={formatCompactNumber(summary.sessions)} changePct={summary.sessionsChangePct} icon={MousePointerClick} />
          <StatCard
            label="Organic sessions"
            value={formatCompactNumber(summary.organicSessions)}
            changePct={summary.organicSessionsChangePct}
            icon={Sprout}
          />
          <StatCard label="Conversions" value={formatCompactNumber(summary.conversions)} changePct={summary.conversionsChangePct} icon={Target} />
          <StatCard
            label="Engagement rate"
            value={formatPercent(summary.engagementRate)}
            hint={`Avg. session ${formatDuration(summary.avgSessionDurationSec)}`}
            icon={Gauge}
          />
        </div>

        <TrafficChangeInsightCard insight={insight} />

        <ChartCard title="Sessions" description="Last 12 weeks">
          <GA4SessionsChart data={summary.sessionsSeries} />
        </ChartCard>

        <GA4LandingPagesTable data={landingPages} />
      </div>
    </>
  );
}
