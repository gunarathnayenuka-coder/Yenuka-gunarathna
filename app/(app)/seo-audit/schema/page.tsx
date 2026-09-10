import { AlertCircle, Braces, CircleCheck, MinusCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { SchemaCoverageCards } from "@/components/seo-audit/schema-coverage-cards";
import { fetchScoreBreakdown } from "@/lib/services/audits";
import { fetchSchemaCoverage } from "@/lib/services/schema-coverage";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function SchemaSeoPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);

  const [website, coverage, scoreBreakdown] = await Promise.all([
    fetchWebsite(websiteId),
    fetchSchemaCoverage(websiteId),
    fetchScoreBreakdown(websiteId),
  ]);

  const fullyCovered = coverage.filter((c) => c.pagesEligible > 0 && c.pagesImplemented === c.pagesEligible).length;
  const withErrors = coverage.filter((c) => c.pagesWithErrors > 0).length;
  const notImplemented = coverage.filter((c) => c.pagesEligible > 0 && c.pagesImplemented === 0).length;

  return (
    <>
      <PageHeader
        title="Structured Data"
        description={`Schema.org coverage across ${website?.domain ?? "this website"}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "SEO Audit", href: "/seo-audit" },
          { label: "Schema" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Schema score" value={`${scoreBreakdown.schema}/100`} icon={Braces} />
          <StatCard label="Types fully covered" value={fullyCovered} icon={CircleCheck} />
          <StatCard label="Types with markup errors" value={withErrors} icon={AlertCircle} />
          <StatCard label="Types not implemented" value={notImplemented} icon={MinusCircle} />
        </div>
        <SchemaCoverageCards coverage={coverage} />
      </div>
    </>
  );
}
