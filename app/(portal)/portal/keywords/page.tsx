import { KeyRound, Target, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared";
import { PortalKeywordsTable } from "@/components/portal/keywords-table";
import { fetchClient } from "@/lib/services/clients";
import { fetchKeywords } from "@/lib/services/keywords";
import { formatNumber } from "@/lib/format";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";

export default async function PortalKeywordsPage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;
  const keywords = await fetchKeywords(client.primaryWebsiteId);

  const top10Count = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  const improvingCount = keywords.filter((k) => k.trend === "up").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Keywords</h1>
        <p className="text-muted-foreground">Search terms we&apos;re tracking for {client.name}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Keywords tracked" value={formatNumber(keywords.length)} icon={KeyRound} />
        <StatCard label="In top 10" value={formatNumber(top10Count)} icon={Target} />
        <StatCard label="Improving" value={formatNumber(improvingCount)} icon={TrendingUp} />
      </div>

      <PortalKeywordsTable data={keywords} />
    </div>
  );
}
