import { Gauge, Handshake, Swords, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { LinkOpportunitiesTable } from "@/components/backlinks/opportunities-table";
import { fetchLinkOpportunities } from "@/lib/services/backlinks";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function LinkOpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, opportunities] = await Promise.all([fetchWebsite(websiteId), fetchLinkOpportunities(websiteId)]);

  const highRelevance = opportunities.filter((o) => o.relevance === "high").length;
  const linksToCompetitors = opportunities.filter((o) => o.linksToCompetitorIds.length > 0).length;
  const avgDomainRating = Math.round(opportunities.reduce((sum, o) => sum + o.domainRating, 0) / (opportunities.length || 1));

  return (
    <>
      <PageHeader
        title="Link Opportunities"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Backlinks", href: "/backlinks" }, { label: "Opportunities" }]}
        description={
          website
            ? `Sites worth reaching out to for a link to ${website.domain} — a discovery list for human-led outreach, not auto-acquisition.`
            : "A discovery list for human-led outreach, not an automated link-building tool."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Opportunities found" value={formatCompactNumber(opportunities.length)} icon={Target} />
          <StatCard label="High relevance" value={formatCompactNumber(highRelevance)} icon={Handshake} />
          <StatCard label="Link to your competitors" value={formatCompactNumber(linksToCompetitors)} icon={Swords} />
          <StatCard label="Average domain rating" value={opportunities.length ? avgDomainRating : "—"} icon={Gauge} />
        </div>

        <LinkOpportunitiesTable data={opportunities} />
      </div>
    </>
  );
}
