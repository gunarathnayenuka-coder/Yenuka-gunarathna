import { Eye, MousePointerClick, Percent, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, ChartCard } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeSelect } from "@/components/analytics/date-range-select";
import { GSCClicksChart } from "@/components/analytics/gsc-clicks-chart";
import { GSCQueriesTable } from "@/components/analytics/gsc-queries-table";
import { GSCPagesTable } from "@/components/analytics/gsc-pages-table";
import { fetchGSCPages, fetchGSCQueries, fetchGSCSummary } from "@/lib/services/analytics";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber, formatPercent } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function SearchConsolePage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, summary, queries, pages] = await Promise.all([
    fetchWebsite(websiteId),
    fetchGSCSummary(websiteId),
    fetchGSCQueries(websiteId),
    fetchGSCPages(websiteId),
  ]);

  return (
    <>
      <PageHeader
        title="Search Console"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Analytics", href: "/analytics/gsc" }, { label: "Search Console" }]}
        description={
          website ? `Google Search Console performance for ${website.domain}` : "Google Search Console performance for the current website."
        }
        actions={<DateRangeSelect />}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Clicks" value={formatCompactNumber(summary.totalClicks)} changePct={summary.clicksChangePct} icon={MousePointerClick} />
          <StatCard label="Impressions" value={formatCompactNumber(summary.totalImpressions)} changePct={summary.impressionsChangePct} icon={Eye} />
          <StatCard label="Average CTR" value={formatPercent(summary.avgCtr)} icon={Percent} />
          <StatCard
            label="Average position"
            value={summary.avgPosition.toFixed(1)}
            hint={`${summary.positionChange > 0 ? "+" : ""}${summary.positionChange.toFixed(1)} vs previous period · lower is better`}
            icon={Target}
          />
        </div>

        <ChartCard title="Clicks & impressions" description="Last 12 weeks">
          <GSCClicksChart data={summary.clicksSeries} />
        </ChartCard>

        <Tabs defaultValue="queries">
          <TabsList>
            <TabsTrigger value="queries">Queries ({queries.length})</TabsTrigger>
            <TabsTrigger value="pages">Pages ({pages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="queries" className="space-y-4">
            <GSCQueriesTable data={queries} />
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <GSCPagesTable data={pages} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
