import Link from "next/link";
import { Globe, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { WebsitesTable } from "@/components/websites/websites-table";
import { listClients } from "@/lib/services/clients";
import { listWebsites } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";

export default async function WebsitesPage() {
  const [websites, clients] = await Promise.all([listWebsites(), listClients()]);
  const avgHealth = Math.round(websites.reduce((sum, w) => sum + w.seoHealthScore, 0) / (websites.length || 1));
  const totalKeywords = websites.reduce((sum, w) => sum + w.trackedKeywords, 0);
  const crawling = websites.filter((w) => w.status === "crawling").length;

  return (
    <>
      <PageHeader
        title="Websites"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Websites" }]}
        description="Every website tracked across all clients."
        actions={
          <Button render={<Link href="/websites/new" />}>
            <Plus /> Add website
          </Button>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total websites" value={websites.length} icon={Globe} hint={crawling > 0 ? `${crawling} crawling now` : undefined} />
          <StatCard label="Average SEO score" value={avgHealth} />
          <StatCard label="Total keywords tracked" value={formatCompactNumber(totalKeywords)} />
          <StatCard label="Total pages indexed" value={formatCompactNumber(websites.reduce((s, w) => s + w.pagesIndexed, 0))} />
        </div>
        <WebsitesTable data={websites} clients={clients} />
      </div>
    </>
  );
}
