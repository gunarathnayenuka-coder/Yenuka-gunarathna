import { CircleCheck, FilePlus, FileText, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { ContentGapTable } from "@/components/competitors/content-gap-table";
import { fetchCompetitorContentGaps } from "@/lib/services/competitors";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function CompetitorContentGapPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, gaps] = await Promise.all([fetchWebsite(websiteId), fetchCompetitorContentGaps(websiteId)]);

  const uncovered = gaps.filter((g) => !g.weCoverTopic);
  const covered = gaps.length - uncovered.length;
  const uncoveredTraffic = uncovered.reduce((sum, g) => sum + g.estTraffic, 0);

  // Uncovered topics (the actionable gaps) first, highest-traffic first within each group.
  const sortedGaps = [...gaps].sort((a, b) => Number(a.weCoverTopic) - Number(b.weCoverTopic) || b.estTraffic - a.estTraffic);

  return (
    <>
      <PageHeader
        title="Content Gap"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Competitors", href: "/competitors" }, { label: "Content Gap" }]}
        description={
          website
            ? `Topics competitors publish on that ${website.domain} doesn't cover yet.`
            : "Topics competitors publish on that this website doesn't cover yet."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Topics tracked" value={formatCompactNumber(gaps.length)} icon={FileText} />
          <StatCard label="Gaps to close" value={formatCompactNumber(uncovered.length)} icon={FilePlus} hint="Not covered yet" />
          <StatCard label="Already covered" value={formatCompactNumber(covered)} icon={CircleCheck} />
          <StatCard label="Est. traffic left on the table" value={formatCompactNumber(uncoveredTraffic)} icon={TrendingUp} />
        </div>

        <ContentGapTable data={sortedGaps} />
      </div>
    </>
  );
}
