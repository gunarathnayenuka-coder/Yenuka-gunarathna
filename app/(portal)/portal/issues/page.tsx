import { CircleCheck, ShieldAlert, Wrench } from "lucide-react";
import type { Severity } from "@/types";
import { SEVERITY_ORDER } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, SeverityBadge, StatCard, StatusBadge } from "@/components/shared";
import { fetchClient } from "@/lib/services/clients";
import { fetchIssues } from "@/lib/services/audits";
import { fetchWebsite } from "@/lib/services/websites";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";

const SEVERITY_INTRO: Record<Severity, string> = {
  critical: "Needs immediate attention",
  high: "High priority — actively being worked on",
  medium: "On our radar for this cycle",
  low: "Minor polish, low urgency",
};

export default async function PortalIssuesPage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;
  const websiteId = client.primaryWebsiteId;
  const [website, issues] = await Promise.all([fetchWebsite(websiteId), fetchIssues(websiteId)]);

  const resolved = issues.filter((i) => i.status === "resolved");
  const open = issues.filter((i) => i.status === "open" || i.status === "in_progress");
  const bySeverity = SEVERITY_ORDER.map((severity) => ({
    severity,
    items: open.filter((i) => i.severity === severity),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SEO Issues</h1>
        <p className="text-muted-foreground">A plain-English look at what we&apos;re finding and fixing on {website!.domain}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Being worked on" value={open.length} icon={Wrench} />
        <StatCard label="Fixed" value={resolved.length} icon={CircleCheck} />
        <StatCard label="Total found" value={issues.length} icon={ShieldAlert} />
      </div>

      {issues.length === 0 ? (
        <EmptyState
          icon={CircleCheck}
          title="Nothing to report"
          description="We haven't found any issues on your site yet."
        />
      ) : (
        <>
          {bySeverity.map((group) => (
            <Card key={group.severity}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SeverityBadge severity={group.severity} />
                  {SEVERITY_INTRO[group.severity]}
                </CardTitle>
                <CardDescription>
                  {group.items.length} item{group.items.length === 1 ? "" : "s"} in progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {group.items.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {issue.description} {issue.affectedPages} page{issue.affectedPages === 1 ? "" : "s"} affected.
                      </p>
                    </div>
                    <StatusBadge status={issue.status} className="shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {resolved.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recently fixed</CardTitle>
                <CardDescription>Great progress — these are done.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resolved.slice(0, 8).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 opacity-80">
                    <p className="truncate text-sm">{issue.title}</p>
                    <StatusBadge status="resolved" className="shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
