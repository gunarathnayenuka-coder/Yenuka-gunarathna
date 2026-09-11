import Link from "next/link";
import { CheckCircle2, ChevronRight, Target, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ScoreRing, StatCard } from "@/components/shared";
import { PortalRecommendationCard } from "@/components/portal/recommendation-card";
import { fetchClient, fetchClientActivity } from "@/lib/services/clients";
import { fetchWebsite } from "@/lib/services/websites";
import { fetchScoreBreakdown } from "@/lib/services/audits";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchRecommendations } from "@/lib/services/ai";
import { formatCompactNumber, formatDate, formatNumber } from "@/lib/format";
import { pickMany, randFloat, REFERENCE_NOW, rngFor } from "@/lib/mock-data";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";
import type { Website } from "@/types";

const NEXT_MONTH_BULLET_POOL = [
  "Publish 2 new blog articles targeting high-intent keywords",
  "Build 5-8 new backlinks from relevant industry sites",
  "Optimize page titles and meta descriptions on key landing pages",
  "Fix remaining technical SEO issues from the latest crawl",
  "Expand keyword tracking to include emerging search terms",
  "Refresh underperforming content with updated information",
  "Improve Core Web Vitals scores on mobile",
  "Launch a local SEO push for nearby service areas",
  "Set up additional schema markup for rich results",
  "Run a competitor gap analysis to find new opportunities",
  "Strengthen internal linking across service pages",
  "Prepare next month's performance report and strategy call",
];

function nextMonthFocus(clientId: string): string[] {
  return pickMany(rngFor(`portal-next-month-${clientId}`), NEXT_MONTH_BULLET_POOL, 4);
}

/** No dedicated "leads" data exists yet — estimate one from traffic, clearly labeled as such in the UI. */
function estimateLeads(website: Website): { count: number; changePct: number } {
  const rng = rngFor(`portal-leads-${website.id}`);
  const conversionRate = randFloat(rng, 1.4, 3.2, 2) / 100;
  const count = Math.max(3, Math.round(website.organicTraffic * conversionRate));
  const changePct = randFloat(rng, website.organicTrafficChangePct - 8, website.organicTrafficChangePct + 8, 1);
  return { count, changePct };
}

export default async function PortalOverviewPage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;
  const websiteId = client.primaryWebsiteId;

  const [website, scoreBreakdown, keywords, activity, recommendations] = await Promise.all([
    fetchWebsite(websiteId),
    fetchScoreBreakdown(websiteId),
    fetchKeywords(websiteId),
    fetchClientActivity(clientId),
    fetchRecommendations(websiteId),
  ]);

  const improvedCount = keywords.filter((k) => k.trend === "up").length;
  const top10Count = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  const leads = estimateLeads(website!);
  const periodLabel = formatDate(REFERENCE_NOW, { month: "long", year: "numeric" });
  const nextMonth = nextMonthFocus(clientId);
  const firstName = client.contactName.split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground">
          Here&apos;s how {client.name} performed in {periodLabel}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0 py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <ScoreRing score={scoreBreakdown.overall} size={60} strokeWidth={6} />
            <div>
              <p className="text-sm text-muted-foreground">SEO Health</p>
              <p className="text-2xl font-semibold tabular-nums">
                {scoreBreakdown.overall}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </p>
            </div>
          </CardContent>
        </Card>
        <StatCard
          label="Organic Traffic"
          value={formatCompactNumber(website!.organicTraffic)}
          changePct={website!.organicTrafficChangePct}
          icon={TrendingUp}
        />
        <StatCard
          label="Google Rankings"
          value={`+${formatNumber(improvedCount)}`}
          hint={`${top10Count} keyword${top10Count === 1 ? "" : "s"} in the top 10`}
          icon={Target}
        />
        <StatCard
          label="Leads (estimated)"
          value={formatNumber(leads.count)}
          changePct={leads.changePct}
          icon={Users}
          hint="Estimated from traffic — no CRM connected yet"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What we did</CardTitle>
            <CardDescription>Recent work on your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.length === 0 ? (
              <EmptyState title="No activity yet" description="Recent work on your account will show up here." />
            ) : (
              activity.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <div className="min-w-0">
                    <p className="text-foreground">{event.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next month</CardTitle>
            <CardDescription>What we&apos;re focused on next</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {nextMonth.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Where we see the next opportunities</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" render={<Link href="/portal/recommendations" />}>
              View all
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {recommendations.length === 0 ? (
            <EmptyState title="You're all caught up" description="No open recommendations right now." />
          ) : (
            recommendations.slice(0, 3).map((r) => <PortalRecommendationCard key={r.id} recommendation={r} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
