import { FilePlus, Sparkles, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { OpportunitiesTable } from "@/components/keywords/opportunities-table";
import { fetchKeywordOpportunities } from "@/lib/services/keywords";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function KeywordOpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, opportunities] = await Promise.all([fetchWebsite(websiteId), fetchKeywordOpportunities(websiteId)]);

  const avgScore = Math.round(opportunities.reduce((sum, o) => sum + o.opportunityScore, 0) / (opportunities.length || 1));
  const totalVolume = opportunities.reduce((sum, o) => sum + o.volume, 0);
  const contentGaps = opportunities.filter((o) => o.suggestedAction === "create_content").length;

  return (
    <>
      <PageHeader
        title="Opportunities"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Keywords", href: "/keywords" }, { label: "Opportunities" }]}
        description={website ? `Highest-impact keyword opportunities for ${website.domain}` : "Highest-impact keyword opportunities."}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Opportunities found" value={formatCompactNumber(opportunities.length)} icon={Target} />
          <StatCard label="Average opportunity score" value={avgScore} icon={Sparkles} />
          <StatCard label="Combined search volume" value={formatCompactNumber(totalVolume)} icon={TrendingUp} />
          <StatCard label="Content gaps" value={formatCompactNumber(contentGaps)} icon={FilePlus} hint="No page targets these yet" />
        </div>

        <OpportunitiesTable data={opportunities} />
      </div>
    </>
  );
}
