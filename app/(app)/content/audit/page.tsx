import { PageHeader } from "@/components/layout/page-header";
import { ContentAuditTable } from "@/components/content/audit-table";
import { users } from "@/lib/mock-data";
import { fetchContentAuditFindings, fetchContentBriefs, fetchContentItems } from "@/lib/services/content";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function ContentAuditPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, findings, items, briefs] = await Promise.all([
    fetchWebsite(websiteId),
    fetchContentAuditFindings(websiteId),
    fetchContentItems(websiteId),
    fetchContentBriefs(websiteId),
  ]);
  const authorsById = Object.fromEntries(users.map((user) => [user.id, user.name]));

  return (
    <>
      <PageHeader
        title="Content Audit"
        description={`Content quality findings flagged for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Content", href: "/content" }, { label: "Content Audit" }]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <ContentAuditTable data={findings} contentItems={items} briefs={briefs} authorsById={authorsById} />
      </div>
    </>
  );
}
