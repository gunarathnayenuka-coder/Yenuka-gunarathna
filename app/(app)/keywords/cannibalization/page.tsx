import { AlertTriangle, Link2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState, StatCard } from "@/components/shared";
import { CannibalizationIssueCard } from "@/components/keywords/cannibalization-issue-card";
import { fetchCannibalizationIssues } from "@/lib/services/keywords";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function CannibalizationPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, issues] = await Promise.all([fetchWebsite(websiteId), fetchCannibalizationIssues(websiteId)]);

  const highSeverity = issues.filter((i) => i.severity === "high").length;
  const pagesInvolved = new Set(issues.flatMap((i) => i.urls.map((u) => u.url))).size;

  return (
    <>
      <PageHeader
        title="Cannibalization"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Keywords", href: "/keywords" },
          { label: "Cannibalization" },
        ]}
        description={
          website ? `Keywords targeted by multiple competing pages on ${website.domain}` : "Keywords targeted by multiple competing pages."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        {issues.length > 0 && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard label="Issues detected" value={formatCompactNumber(issues.length)} icon={ShieldAlert} />
            <StatCard label="High severity" value={formatCompactNumber(highSeverity)} icon={AlertTriangle} />
            <StatCard label="Pages involved" value={formatCompactNumber(pagesInvolved)} icon={Link2} className="col-span-2 lg:col-span-1" />
          </div>
        )}

        {issues.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No cannibalization issues detected"
            description="Every tracked keyword on this website maps cleanly to a single page — nice work."
          />
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <CannibalizationIssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
