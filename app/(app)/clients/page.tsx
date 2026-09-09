import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ClientsTable } from "@/components/clients/clients-table";
import { listClients } from "@/lib/services/clients";
import { formatCompactNumber } from "@/lib/format";

export default async function ClientsPage() {
  const clients = await listClients();
  const active = clients.filter((c) => c.status === "active").length;
  const avgHealth = Math.round(clients.reduce((sum, c) => sum + c.seoHealthScore, 0) / (clients.length || 1));
  const totalTraffic = clients.reduce((sum, c) => sum + c.organicTraffic, 0);
  const totalIssues = clients.reduce((sum, c) => sum + c.openIssues, 0);

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Clients" }]}
        description="Every client your agency manages, and how their SEO is performing."
        actions={
          <Button render={<Link href="/clients/new" />}>
            <Plus /> Add client
          </Button>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total clients" value={clients.length} icon={Users} hint={`${active} active`} />
          <StatCard label="Average SEO health" value={`${avgHealth}/100`} />
          <StatCard label="Combined organic traffic" value={formatCompactNumber(totalTraffic)} />
          <StatCard label="Open issues" value={totalIssues} />
        </div>
        <ClientsTable data={clients} />
      </div>
    </>
  );
}
