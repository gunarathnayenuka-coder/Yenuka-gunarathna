import { Gauge, Link2, Network, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, ChartCard } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacklinksTable } from "@/components/backlinks/backlinks-table";
import { ReferringDomainsTable } from "@/components/backlinks/referring-domains-table";
import { AnchorTextDistribution } from "@/components/backlinks/anchor-text-distribution";
import { NewVsLostSummary } from "@/components/backlinks/new-vs-lost-summary";
import { fetchBacklinks, fetchLostBacklinks, fetchNewBacklinks, fetchReferringDomains } from "@/lib/services/backlinks";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function BacklinksOverviewPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, backlinks, newBacklinks, lostBacklinks, referringDomains] = await Promise.all([
    fetchWebsite(websiteId),
    fetchBacklinks(websiteId),
    fetchNewBacklinks(websiteId),
    fetchLostBacklinks(websiteId),
    fetchReferringDomains(websiteId),
  ]);

  const avgDomainRating = Math.round(backlinks.reduce((sum, b) => sum + b.domainRating, 0) / (backlinks.length || 1));

  return (
    <>
      <PageHeader
        title="Backlinks"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Backlinks", href: "/backlinks" }, { label: "Overview" }]}
        description={website ? `Backlink profile for ${website.domain}` : "Backlink profile for the current website."}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total backlinks" value={formatCompactNumber(backlinks.length)} icon={Link2} />
          <StatCard label="Referring domains" value={formatCompactNumber(referringDomains.length)} icon={Network} />
          <StatCard label="Average domain rating" value={avgDomainRating} icon={Gauge} />
          <StatCard label="New this month" value={formatCompactNumber(newBacklinks.length)} icon={Sparkles} />
        </div>

        <ChartCard title="New vs. lost backlinks" description="Backlinks gained and lost recently.">
          <NewVsLostSummary newCount={newBacklinks.length} lostCount={lostBacklinks.length} />
        </ChartCard>

        <Tabs defaultValue="backlinks">
          <TabsList>
            <TabsTrigger value="backlinks">Backlinks ({backlinks.length})</TabsTrigger>
            <TabsTrigger value="referring-domains">Referring Domains ({referringDomains.length})</TabsTrigger>
            <TabsTrigger value="anchor-text">Anchor Text</TabsTrigger>
          </TabsList>

          <TabsContent value="backlinks" className="space-y-4">
            <BacklinksTable data={backlinks} showStatusFilter />
          </TabsContent>

          <TabsContent value="referring-domains" className="space-y-4">
            <ReferringDomainsTable data={referringDomains} />
          </TabsContent>

          <TabsContent value="anchor-text">
            <ChartCard title="Anchor text distribution" description="The most common anchor text used across all backlinks.">
              <AnchorTextDistribution backlinks={backlinks} />
            </ChartCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
