import { FilePlus, ShieldCheck, Swords, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { ComparisonTable, type ComparisonMetric } from "@/components/competitors/comparison-table";
import { fetchCompetitorContentGaps, fetchCompetitorKeywordGaps, fetchCompetitors } from "@/lib/services/competitors";
import { fetchReferringDomains } from "@/lib/services/backlinks";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function CompetitorsOverviewPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, competitors, keywords, keywordGaps, contentGaps, referringDomains] = await Promise.all([
    fetchWebsite(websiteId),
    fetchCompetitors(websiteId),
    fetchKeywords(websiteId),
    fetchCompetitorKeywordGaps(websiteId),
    fetchCompetitorContentGaps(websiteId),
    fetchReferringDomains(websiteId),
  ]);

  const ourTop3 = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 3).length;
  const ourTop10 = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  const ourTop20 = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 20).length;

  const avgCompetitorScore = competitors.length
    ? Math.round(competitors.reduce((sum, c) => sum + c.technicalScore, 0) / competitors.length)
    : 0;

  const metrics: ComparisonMetric[] = website
    ? [
        { label: "Organic keywords", you: website.trackedKeywords, competitorValues: competitors.map((c) => c.organicKeywords) },
        { label: "Top 3 rankings", you: ourTop3, competitorValues: competitors.map((c) => c.top3Keywords) },
        { label: "Top 10 rankings", you: ourTop10, competitorValues: competitors.map((c) => c.top10Keywords) },
        { label: "Top 20 rankings", you: ourTop20, competitorValues: competitors.map((c) => c.top20Keywords) },
        { label: "Est. monthly traffic", you: website.organicTraffic, competitorValues: competitors.map((c) => c.estMonthlyTraffic) },
        { label: "Content pages", you: website.pagesIndexed, competitorValues: competitors.map((c) => c.contentPages) },
        { label: "Referring domains", you: referringDomains.length, competitorValues: competitors.map((c) => c.referringDomains) },
        {
          label: "SEO score",
          you: website.seoHealthScore,
          competitorValues: competitors.map((c) => c.technicalScore),
          colorByScore: true,
          format: (v) => `${v}`,
        },
      ]
    : [];

  const insights = competitors
    .map((competitor) => ({
      competitor,
      count: keywordGaps.filter((g) => g.competitorRanks.some((r) => r.competitorId === competitor.id)).length,
    }))
    .filter((i) => i.count > 0)
    .sort((a, b) => b.count - a.count);

  const uncoveredTopics = contentGaps.filter((g) => !g.weCoverTopic).length;

  return (
    <>
      <PageHeader
        title="Competitor Overview"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Competitors", href: "/competitors" }, { label: "Overview" }]}
        description={
          website
            ? `How ${website.domain} stacks up against its tracked competitors.`
            : "How this website stacks up against its tracked competitors."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Competitors tracked" value={competitors.length} icon={Swords} />
          <StatCard
            label="Your SEO score"
            value={website?.seoHealthScore ?? "—"}
            icon={ShieldCheck}
            hint={`Avg competitor: ${avgCompetitorScore}`}
          />
          <StatCard label="Keyword gaps found" value={formatCompactNumber(keywordGaps.length)} icon={Target} />
          <StatCard
            label="Content gaps found"
            value={formatCompactNumber(uncoveredTopics)}
            icon={FilePlus}
            hint={`${contentGaps.length} topics tracked`}
          />
        </div>

        {website && metrics.length > 0 && (
          <ComparisonTable websiteDomain={website.domain} competitors={competitors} metrics={metrics} />
        )}

        {insights.length > 0 && (
          <div className="space-y-2 rounded-lg border p-4">
            <h2 className="text-sm font-semibold">Competitor insights</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {insights.map(({ competitor, count }) => (
                <li key={competitor.id}>
                  <span className="font-medium text-foreground">{competitor.domain}</span> outranks you on {count} tracked
                  keyword{count === 1 ? "" : "s"} you&apos;re not capturing.
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
