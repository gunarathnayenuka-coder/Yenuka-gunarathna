import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { TechnicalChecksBoard } from "@/components/seo-audit/technical-checks-board";
import { fetchScoreBreakdown } from "@/lib/services/audits";
import { fetchTechnicalChecks } from "@/lib/services/technical-checks";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function TechnicalSeoPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);

  const [website, checks, scoreBreakdown] = await Promise.all([
    fetchWebsite(websiteId),
    fetchTechnicalChecks(websiteId),
    fetchScoreBreakdown(websiteId),
  ]);

  const passing = checks.filter((c) => c.status === "pass").length;
  const warnings = checks.filter((c) => c.status === "warning").length;
  const failing = checks.filter((c) => c.status === "fail").length;

  return (
    <>
      <PageHeader
        title="Technical SEO"
        description={`Crawlability, indexability, and site-health checks for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "SEO Audit", href: "/seo-audit" },
          { label: "Technical SEO" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Technical score" value={`${scoreBreakdown.technical}/100`} />
          <StatCard label="Checks passing" value={passing} icon={CircleCheck} />
          <StatCard label="Warnings" value={warnings} icon={TriangleAlert} />
          <StatCard label="Failing checks" value={failing} icon={CircleAlert} />
        </div>
        <TechnicalChecksBoard checks={checks} />
      </div>
    </>
  );
}
