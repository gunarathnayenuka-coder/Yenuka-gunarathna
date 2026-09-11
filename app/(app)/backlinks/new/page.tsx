import { Gauge, Globe, Link2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { BacklinksTable } from "@/components/backlinks/backlinks-table";
import { fetchNewBacklinks } from "@/lib/services/backlinks";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function NewBacklinksPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, backlinks] = await Promise.all([fetchWebsite(websiteId), fetchNewBacklinks(websiteId)]);

  const uniqueDomains = new Set(backlinks.map((b) => b.sourceDomain)).size;
  const avgDomainRating = Math.round(backlinks.reduce((sum, b) => sum + b.domainRating, 0) / (backlinks.length || 1));
  const dofollow = backlinks.filter((b) => b.linkType === "dofollow").length;

  return (
    <>
      <PageHeader
        title="New Backlinks"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Backlinks", href: "/backlinks" }, { label: "New Backlinks" }]}
        description={
          website
            ? `Backlinks discovered in the last 14 days for ${website.domain}`
            : "Backlinks discovered in the last 14 days."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="New backlinks" value={formatCompactNumber(backlinks.length)} icon={Sparkles} />
          <StatCard label="New referring domains" value={formatCompactNumber(uniqueDomains)} icon={Globe} />
          <StatCard label="Average domain rating" value={avgDomainRating} icon={Gauge} />
          <StatCard label="Dofollow links" value={formatCompactNumber(dofollow)} icon={Link2} />
        </div>

        <BacklinksTable
          data={backlinks}
          emptyTitle="No new backlinks"
          emptyDescription="No backlinks have been discovered in the last 14 days."
        />
      </div>
    </>
  );
}
