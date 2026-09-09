import Link from "next/link";
import { Globe, KeyRound, LayoutDashboard, ShieldAlert, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, ScoreRing, ScoreBar, AIRecommendationCard, EmptyState } from "@/components/shared";
import { ChangeIndicator } from "@/components/shared/trend-indicator";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { HealthTrendChart } from "@/components/dashboard/health-trend-chart";
import { IssuesSummary } from "@/components/dashboard/issues-summary";
import { clients, currentUser, websites } from "@/lib/mock-data";
import { fetchRecommendations } from "@/lib/services/ai";
import { fetchIssues, fetchScoreBreakdown, fetchScoreHistory } from "@/lib/services/audits";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchTrafficHistory, fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber, formatNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const website = (await fetchWebsite(websiteId))!;
  const client = clients.find((c) => c.id === website.clientId)!;

  const [scoreBreakdown, scoreHistory, trafficHistory, issues, keywords, recommendations] = await Promise.all([
    fetchScoreBreakdown(websiteId),
    fetchScoreHistory(websiteId),
    fetchTrafficHistory(websiteId),
    fetchIssues(websiteId),
    fetchKeywords(websiteId),
    fetchRecommendations(websiteId),
  ]);

  const openIssues = issues.filter((i) => i.status === "open" || i.status === "in_progress");
  const top10Keywords = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  const attentionClients = [...clients].sort((a, b) => a.seoHealthScore - b.seoHealthScore).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Good morning, ${currentUser.name.split(" ")[0]} 👋`}
        description={`Here's what's happening across ${client.name} — ${website.domain} today.`}
        actions={
          <>
            <Button variant="outline" render={<Link href="/reports" />}>
              View reports
            </Button>
            <Button render={<Link href="/ai-assistant" />}>
              <LayoutDashboard /> Ask AI Copilot
            </Button>
          </>
        }
      />

      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
          <StatCard label="Total clients" value={clients.length} icon={Users} className="xl:col-span-1" />
          <StatCard label="Total websites" value={websites.length} icon={Globe} className="xl:col-span-1" />
          <StatCard label="SEO health" value={`${website.seoHealthScore}/100`} icon={ShieldAlert} className="xl:col-span-1" />
          <StatCard
            label="Organic traffic"
            value={formatCompactNumber(website.organicTraffic)}
            changePct={website.organicTrafficChangePct}
            icon={TrendingUp}
            className="xl:col-span-1"
          />
          <StatCard label="Keywords tracked" value={formatNumber(keywords.length)} icon={KeyRound} className="xl:col-span-1" />
          <StatCard label="Top 10 keywords" value={formatNumber(top10Keywords)} icon={KeyRound} className="xl:col-span-1" />
          <StatCard label="Open issues" value={formatNumber(openIssues.length)} icon={ShieldAlert} className="xl:col-span-1" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>SEO Health</CardTitle>
              <CardDescription>Overall score breakdown for {website.domain}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-center">
                <ScoreRing score={scoreBreakdown.overall} size={128} label="/ 100" />
              </div>
              <div className="space-y-3">
                <ScoreBar label="Technical SEO" score={scoreBreakdown.technical} />
                <ScoreBar label="On-Page SEO" score={scoreBreakdown.onPage} />
                <ScoreBar label="Content" score={scoreBreakdown.content} />
                <ScoreBar label="Performance" score={scoreBreakdown.performance} />
                <ScoreBar label="Authority" score={scoreBreakdown.authority} />
              </div>
              <Button variant="outline" size="sm" className="w-full" render={<Link href="/seo-audit" />}>
                View full audit
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Organic traffic</CardTitle>
              <CardDescription>Last 12 weeks · {website.domain}</CardDescription>
              <CardAction>
                <ChangeIndicator pct={website.organicTrafficChangePct} />
              </CardAction>
            </CardHeader>
            <CardContent>
              <TrafficChart data={trafficHistory} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🤖 AI SEO Copilot</CardTitle>
            <CardDescription>Your highest-impact opportunities right now — reviewed and prioritized by AI.</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" render={<Link href="/ai-assistant" />}>
                View all actions
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recommendations.length === 0 ? (
              <EmptyState title="No open recommendations" description="This website is in great shape. Check back after the next crawl." />
            ) : (
              recommendations.slice(0, 5).map((rec) => <AIRecommendationCard key={rec.id} recommendation={rec} />)
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Open SEO issues</CardTitle>
              <CardDescription>By severity, across {website.domain}</CardDescription>
              <CardAction>
                <Button variant="outline" size="sm" render={<Link href="/seo-audit/issues" />}>
                  View all
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <IssuesSummary issues={issues} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO health trend</CardTitle>
              <CardDescription>12-week trend</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthTrendChart data={scoreHistory} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clients needing attention</CardTitle>
            <CardDescription>Lowest SEO health scores across your portfolio</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" render={<Link href="/clients" />}>
                View all clients
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-1">
            {attentionClients.map((c) => (
              <Link
                key={c.id}
                href={`/clients/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-accent/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.industry} · {c.country}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <GenericStatusBadge status={c.status} />
                  <span className="w-10 text-right text-sm font-semibold tabular-nums">{c.seoHealthScore}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
