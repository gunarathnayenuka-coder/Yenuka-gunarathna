import Link from "next/link";
import { cn } from "cn";
import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { IssuesTable } from "@/components/seo-audit/issues-table";
import { fetchIssues } from "@/lib/services/audits";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteId, type SearchParams } from "@/lib/website-context";
import type { Severity } from "@/types";
import { SEVERITY_ORDER } from "@/types";

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function normalizeSeverity(value: string | string[] | undefined): Severity | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && (SEVERITY_ORDER as string[]).includes(raw) ? (raw as Severity) : undefined;
}

export default async function SeoIssuesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const websiteId = resolveWebsiteId(params.site);
  const severityFilter = normalizeSeverity(params.severity);

  const [website, issues] = await Promise.all([fetchWebsite(websiteId), fetchIssues(websiteId)]);

  const counts: Record<Severity, number> = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };
  const openCount = issues.filter((i) => i.status === "open" || i.status === "in_progress").length;
  const filteredIssues = severityFilter ? issues.filter((i) => i.severity === severityFilter) : issues;

  function severityHref(severity?: Severity): string {
    const qs = new URLSearchParams({ site: websiteId });
    if (severity) qs.set("severity", severity);
    return `/seo-audit/issues?${qs.toString()}`;
  }

  return (
    <>
      <PageHeader
        title="SEO Issues"
        description={`Every open and resolved SEO issue detected for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "SEO Audit", href: "/seo-audit" },
          { label: "Issues" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total issues" value={issues.length} icon={ShieldAlert} />
          <StatCard label="Open / in progress" value={openCount} />
          <StatCard label="Critical" value={counts.critical} />
          <StatCard label="High" value={counts.high} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={severityHref()}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              !severityFilter ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            All ({issues.length})
          </Link>
          {SEVERITY_ORDER.map((severity) => (
            <Link
              key={severity}
              href={severityHref(severity)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                severityFilter === severity ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent",
              )}
            >
              {SEVERITY_LABELS[severity]} ({counts[severity]})
            </Link>
          ))}
        </div>

        <IssuesTable
          data={filteredIssues}
          emptyTitle={severityFilter ? `No ${SEVERITY_LABELS[severityFilter]} issues` : "No issues found"}
          emptyDescription={
            severityFilter
              ? "Nothing at this severity right now — try another filter or check back after the next crawl."
              : "This website has no recorded SEO issues yet."
          }
        />
      </div>
    </>
  );
}
