import { PageHeader } from "@/components/layout/page-header";
import { ContentPlannerBoard } from "@/components/content/content-planner-board";
import { users } from "@/lib/mock-data";
import { fetchContentBriefs, fetchContentItems } from "@/lib/services/content";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function ContentPlannerPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, items, briefs] = await Promise.all([
    fetchWebsite(websiteId),
    fetchContentItems(websiteId),
    fetchContentBriefs(websiteId),
  ]);
  const authorsById = Object.fromEntries(users.map((user) => [user.id, user.name]));

  return (
    <>
      <PageHeader
        title="Content Planner"
        description={`Every content item for ${website?.domain ?? "this website"}, grouped by status.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Content", href: "/content" }, { label: "Content Planner" }]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <ContentPlannerBoard items={items} briefs={briefs} authorsById={authorsById} />
      </div>
    </>
  );
}
