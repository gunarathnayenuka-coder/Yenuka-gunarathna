import { CircleX, Sparkles, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { KeywordGapTable } from "@/components/competitors/keyword-gap-table";
import { fetchCompetitorKeywordGaps, fetchCompetitors } from "@/lib/services/competitors";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function CompetitorKeywordGapPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, gaps, competitors] = await Promise.all([
    fetchWebsite(websiteId),
    fetchCompetitorKeywordGaps(websiteId),
    fetchCompetitors(websiteId),
  ]);

  const avgOpportunity = Math.round(gaps.reduce((sum, g) => sum + g.opportunityScore, 0) / (gaps.length || 1));
  const totalVolume = gaps.reduce((sum, g) => sum + g.volume, 0);
  const notRankingAtAll = gaps.filter((g) => g.ourRank === null).length;

  return (
    <>
      <PageHeader
        title="Keyword Gap"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Competitors", href: "/competitors" }, { label: "Keyword Gap" }]}
        description={
          website
            ? `Keywords competitors rank for that ${website.domain} doesn't — sorted by opportunity.`
            : "Keywords competitors rank for that this website doesn't."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Keyword gaps found" value={formatCompactNumber(gaps.length)} icon={Target} />
          <StatCard label="Average opportunity score" value={avgOpportunity} icon={Sparkles} />
          <StatCard label="Combined search volume" value={formatCompactNumber(totalVolume)} icon={TrendingUp} />
          <StatCard label="Not ranking at all" value={formatCompactNumber(notRankingAtAll)} icon={CircleX} />
        </div>

        <KeywordGapTable data={gaps} competitors={competitors} />
      </div>
    </>
  );
}
