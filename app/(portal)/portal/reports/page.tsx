import { EmptyState } from "@/components/shared";
import { PortalReportRow } from "@/components/portal/report-row";
import { fetchClient } from "@/lib/services/clients";
import { fetchReportsByClient } from "@/lib/services/reports";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";

export default async function PortalReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;
  const reports = await fetchReportsByClient(clientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Monthly and ad-hoc performance reports we&apos;ve prepared for {client.name}.</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState title="No reports yet" description="Your first performance report will appear here once it's ready." />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <PortalReportRow key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
