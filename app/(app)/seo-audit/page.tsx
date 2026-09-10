import Link from "next/link";
import { AlertCircle, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ScoreBar, ScoreRing, StatCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueSeveritySummary } from "@/components/seo-audit/issue-severity-summary";
import { ScoreHistoryChart } from "@/components/seo-audit/score-history-chart";
import { fetchIssues, fetchScoreBreakdown, fetchScoreHistory } from "@/lib/services/audits";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function SeoAuditOverviewPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const website = (await fetchWebsite(websiteId))!;

  const [scoreBreakdown, scoreHistory, issues] = await Promise.all([
    fetchScoreBreakdown(websiteId),
    fetchScoreHistory(websiteId),
    fetchIssues(websiteId),
  ]);

  const openIssues = issues.filter((i) => i.status === "open" || i.status === "in_progress");
  const criticalIssues = openIssues.filter((i) => i.severity === "critical").length;
  const highIssues = openIssues.filter((i) => i.severity === "high").length;

  return (
    <>
      <PageHeader
        title="SEO Audit Overview"
        description={`Full technical, on-page, and performance health for ${website.domain}.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "SEO Audit" }]}
        actions={
          <Button variant="outline" render={<Link href={`/seo-audit/issues?site=${websiteId}`} />}>
            View all issues
          </Button>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="SEO health score" value={`${scoreBreakdown.overall}/100`} icon={ShieldCheck} />
          <StatCard label="Open issues" value={openIssues.length} icon={ShieldAlert} />
          <StatCard label="Critical issues" value={criticalIssues} icon={AlertTriangle} />
          <StatCard label="High-priority issues" value={highIssues} icon={AlertCircle} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Score breakdown</CardTitle>
              <CardDescription>How each audit category contributes to the overall score</CardDescription>
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
                <ScoreBar label="Internal Linking" score={scoreBreakdown.internalLinking} />
                <ScoreBar label="Schema" score={scoreBreakdown.schema} />
                <ScoreBar label="Authority" score={scoreBreakdown.authority} />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>SEO health trend</CardTitle>
              <CardDescription>12-week trend · {website.domain}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreHistoryChart data={scoreHistory} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Open issues by severity</CardTitle>
            <CardDescription>Jump straight into the filtered issue list</CardDescription>
          </CardHeader>
          <CardContent>
            <IssueSeveritySummary issues={issues} websiteId={websiteId} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
