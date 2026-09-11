import { CalendarClock, FileText, Pencil, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { ReportsTable } from "@/components/reports/reports-table";
import { ReportBuilder } from "@/components/reports/report-builder";
import { listClients } from "@/lib/services/clients";
import { fetchReportsByClient, listReports } from "@/lib/services/reports";
import { reportSchedules } from "@/lib/mock-data/reports";
import type { SearchParams } from "@/lib/website-context";

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const clientParam = Array.isArray(params.client) ? params.client[0] : params.client;

  const allClients = await listClients();
  const clientId = clientParam && allClients.some((c) => c.id === clientParam) ? clientParam : undefined;
  const selectedClient = clientId ? allClients.find((c) => c.id === clientId) : undefined;

  const reports = clientId ? await fetchReportsByClient(clientId) : await listReports();

  const sentCount = reports.filter((r) => r.status === "sent").length;
  const draftCount = reports.filter((r) => r.status === "draft").length;
  const relevantSchedules = clientId ? reportSchedules.filter((s) => s.clientId === clientId) : reportSchedules;
  const activeSchedules = relevantSchedules.filter((s) => s.isEnabled).length;

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Reports" }]}
        description={
          selectedClient
            ? `Client reports for ${selectedClient.name}.`
            : "Every generated, sent and scheduled report across your agency."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total reports" value={reports.length} icon={FileText} />
          <StatCard label="Sent to clients" value={sentCount} icon={Send} />
          <StatCard label="Drafts" value={draftCount} icon={Pencil} />
          <StatCard label="Active schedules" value={activeSchedules} icon={CalendarClock} />
        </div>

        <ReportsTable data={reports} clients={allClients} />

        <ReportBuilder clients={allClients} initialClientId={clientId} />
      </div>
    </>
  );
}
