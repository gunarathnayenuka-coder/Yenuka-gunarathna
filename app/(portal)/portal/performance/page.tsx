import { ShieldCheck, TrendingUp } from "lucide-react";
import { ChartCard, StatCard } from "@/components/shared";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { HealthTrendChart } from "@/components/dashboard/health-trend-chart";
import { fetchClient } from "@/lib/services/clients";
import { fetchTrafficHistory, fetchWebsite } from "@/lib/services/websites";
import { fetchScoreHistory } from "@/lib/services/audits";
import { formatCompactNumber } from "@/lib/format";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";

export default async function PortalPerformancePage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;
  const websiteId = client.primaryWebsiteId;

  const [website, trafficHistory, scoreHistory] = await Promise.all([
    fetchWebsite(websiteId),
    fetchTrafficHistory(websiteId),
    fetchScoreHistory(websiteId),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">Traffic and SEO health trends for {website!.domain}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Organic traffic"
          value={formatCompactNumber(website!.organicTraffic)}
          changePct={website!.organicTrafficChangePct}
          icon={TrendingUp}
        />
        <StatCard label="SEO health score" value={`${website!.seoHealthScore}/100`} icon={ShieldCheck} />
      </div>

      <ChartCard title="Organic traffic" description="Last 12 weeks">
        <TrafficChart data={trafficHistory} />
      </ChartCard>

      <ChartCard title="SEO health trend" description="Last 12 weeks">
        <HealthTrendChart data={scoreHistory} />
      </ChartCard>
    </div>
  );
}
