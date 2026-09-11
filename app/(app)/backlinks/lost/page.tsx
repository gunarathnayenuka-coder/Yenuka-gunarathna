import { AlertTriangle, CircleX, Globe, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BacklinksTable } from "@/components/backlinks/backlinks-table";
import { fetchLostBacklinks } from "@/lib/services/backlinks";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function LostBacklinksPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, backlinks] = await Promise.all([fetchWebsite(websiteId), fetchLostBacklinks(websiteId)]);

  const uniqueDomains = new Set(backlinks.map((b) => b.sourceDomain)).size;
  const highAuthorityLost = backlinks.filter((b) => b.domainRating >= 50).length;
  const avgDomainRating = Math.round(backlinks.reduce((sum, b) => sum + b.domainRating, 0) / (backlinks.length || 1));

  return (
    <>
      <PageHeader
        title="Lost Backlinks"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Backlinks", href: "/backlinks" }, { label: "Lost Backlinks" }]}
        description={website ? `Backlinks no longer pointing to ${website.domain}` : "Backlinks no longer pointing to this website."}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Lost backlinks" value={formatCompactNumber(backlinks.length)} icon={CircleX} />
          <StatCard label="Domains lost" value={formatCompactNumber(uniqueDomains)} icon={Globe} />
          <StatCard label="High-authority losses" value={formatCompactNumber(highAuthorityLost)} icon={TrendingDown} hint="DR 50+" />
          <StatCard label="Average domain rating" value={backlinks.length ? avgDomainRating : "—"} />
        </div>

        {backlinks.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>Lost backlinks are a negative signal</AlertTitle>
            <AlertDescription>
              Review these before they affect rankings — reach out to the source, restore the content, or find a
              replacement link.
            </AlertDescription>
          </Alert>
        )}

        <BacklinksTable
          data={backlinks}
          emptyTitle="No lost backlinks"
          emptyDescription="Every backlink we've discovered for this website is still live — nice work."
        />
      </div>
    </>
  );
}
