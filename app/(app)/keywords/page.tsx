import { Gauge, KeyRound, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { KeywordsTable } from "@/components/keywords/keywords-table";
import { PriorityKeywordsCard } from "@/components/keywords/priority-keywords-card";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function KeywordResearchPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, keywords] = await Promise.all([fetchWebsite(websiteId), fetchKeywords(websiteId)]);

  const avgDifficulty = Math.round(keywords.reduce((sum, k) => sum + k.difficulty, 0) / (keywords.length || 1));
  const top10Count = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);

  return (
    <>
      <PageHeader
        title="Keyword Research"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Keywords", href: "/keywords" }, { label: "Research" }]}
        description={website ? `Tracked keywords for ${website.domain}` : "Tracked keywords for the current website."}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Tracked keywords" value={formatCompactNumber(keywords.length)} icon={KeyRound} />
          <StatCard label="Average difficulty" value={avgDifficulty} icon={Gauge} />
          <StatCard label="Ranking in top 10" value={formatCompactNumber(top10Count)} icon={Target} />
          <StatCard label="Total search volume" value={formatCompactNumber(totalVolume)} icon={TrendingUp} />
        </div>

        <PriorityKeywordsCard keywords={keywords} websiteId={websiteId} />

        <KeywordsTable data={keywords} />
      </div>
    </>
  );
}
