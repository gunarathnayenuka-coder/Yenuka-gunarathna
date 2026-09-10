import { ArrowDown, ArrowUp, CircleX, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingHistoryChart } from "@/components/keywords/ranking-history-chart";
import { RankingsTable } from "@/components/keywords/rankings-table";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function KeywordRankingsPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, keywords] = await Promise.all([fetchWebsite(websiteId), fetchKeywords(websiteId)]);

  const improved = keywords.filter((k) => k.trend === "up").length;
  const declined = keywords.filter((k) => k.trend === "down").length;
  const newEntries = keywords.filter((k) => k.trend === "new").length;
  const lost = keywords.filter((k) => k.trend === "lost").length;

  const chartKeywords = [...keywords].sort((a, b) => b.volume - a.volume).slice(0, 8);

  return (
    <>
      <PageHeader
        title="Rankings"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Keywords", href: "/keywords" }, { label: "Rankings" }]}
        description={website ? `Rank movement for ${website.domain}` : "Rank movement for the current website."}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Improved" value={formatCompactNumber(improved)} icon={ArrowUp} />
          <StatCard label="Declined" value={formatCompactNumber(declined)} icon={ArrowDown} />
          <StatCard label="New rankings" value={formatCompactNumber(newEntries)} icon={Sparkles} />
          <StatCard label="Lost rankings" value={formatCompactNumber(lost)} icon={CircleX} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ranking history</CardTitle>
            <CardDescription>Biweekly rank for the top tracked keywords by search volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <RankingHistoryChart keywords={chartKeywords} />
          </CardContent>
        </Card>

        <RankingsTable data={keywords} />
      </div>
    </>
  );
}
