import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, KeyRound, RefreshCw, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, ScoreBar } from "@/components/shared";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsitePagesTable } from "@/components/websites/website-pages-table";
import { fetchClient } from "@/lib/services/clients";
import { fetchCrawlRuns, fetchWebsite, fetchWebsitePages } from "@/lib/services/websites";
import { fetchIssues, fetchScoreBreakdown } from "@/lib/services/audits";
import { formatCompactNumber, formatDate, formatRelativeTime } from "@/lib/format";

export default async function WebsiteOverviewPage({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  const website = await fetchWebsite(websiteId);
  if (!website) notFound();

  const [client, pages, crawlRuns, issues, scoreBreakdown] = await Promise.all([
    fetchClient(website.clientId),
    fetchWebsitePages(websiteId),
    fetchCrawlRuns(websiteId),
    fetchIssues(websiteId),
    fetchScoreBreakdown(websiteId),
  ]);

  const openIssues = issues.filter((i) => i.status === "open" || i.status === "in_progress");

  return (
    <>
      <PageHeader
        title={website.domain}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Websites", href: "/websites" },
          { label: website.domain },
        ]}
        description={client ? `${client.name} · ${website.country}` : website.country}
        actions={
          <>
            <Button variant="outline" render={<Link href={website.url} target="_blank" />}>
              <ExternalLink /> Visit site
            </Button>
            <Button>
              <RefreshCw /> Run crawl now
            </Button>
          </>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="SEO health" value={`${website.seoHealthScore}/100`} icon={ShieldAlert} />
          <StatCard
            label="Organic traffic"
            value={formatCompactNumber(website.organicTraffic)}
            changePct={website.organicTrafficChangePct}
          />
          <StatCard label="Keywords tracked" value={formatCompactNumber(website.trackedKeywords)} icon={KeyRound} />
          <StatCard label="Open issues" value={openIssues.length} icon={ShieldAlert} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pages">Pages ({pages.length})</TabsTrigger>
            <TabsTrigger value="crawls">Crawl History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>SEO score breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ScoreBar label="Technical SEO" score={scoreBreakdown.technical} />
                  <ScoreBar label="On-Page SEO" score={scoreBreakdown.onPage} />
                  <ScoreBar label="Content" score={scoreBreakdown.content} />
                  <ScoreBar label="Performance" score={scoreBreakdown.performance} />
                  <ScoreBar label="Internal Linking" score={scoreBreakdown.internalLinking} />
                  <ScoreBar label="Schema" score={scoreBreakdown.schema} />
                  <ScoreBar label="Authority" score={scoreBreakdown.authority} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Website details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <GenericStatusBadge status={website.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Search engine</span>
                    <span className="font-medium capitalize">{website.searchEngine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages indexed</span>
                    <span className="font-medium">{formatCompactNumber(website.pagesIndexed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last crawl</span>
                    <span className="font-medium">{formatRelativeTime(website.lastCrawlAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next scheduled crawl</span>
                    <span className="font-medium">{formatDate(website.nextCrawlAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Added</span>
                    <span className="font-medium">{formatDate(website.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages">
            <WebsitePagesTable data={pages} />
          </TabsContent>

          <TabsContent value="crawls">
            <Card>
              <CardContent className="divide-y p-0">
                {crawlRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{formatDate(run.startedAt, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                      <p className="text-xs text-muted-foreground capitalize">{run.trigger} crawl</p>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <span>{formatCompactNumber(run.pagesCrawled)} pages</span>
                      <span className={run.issuesFound > 15 ? "font-medium text-critical" : ""}>{run.issuesFound} issues</span>
                      <GenericStatusBadge status={run.status} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
