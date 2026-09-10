import { AlignLeft, Heading, Image as ImageIcon, Type } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { OnPageTable } from "@/components/seo-audit/on-page-table";
import { getOnPageFlags } from "@/components/seo-audit/on-page-issues";
import { fetchWebsite, fetchWebsitePages } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function OnPageSeoPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);

  const [website, pages] = await Promise.all([fetchWebsite(websiteId), fetchWebsitePages(websiteId)]);

  const titleIssues = pages.filter((p) => getOnPageFlags(p).titleIssue).length;
  const metaIssues = pages.filter((p) => getOnPageFlags(p).metaDescriptionIssue).length;
  const h1Issues = pages.filter((p) => getOnPageFlags(p).h1Issue).length;
  const imageIssues = pages.filter((p) => getOnPageFlags(p).imagesIssue).length;

  return (
    <>
      <PageHeader
        title="On-Page SEO"
        description={`Titles, meta descriptions, headings, and content signals across ${pages.length} crawled pages on ${website?.domain ?? "this website"}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "SEO Audit", href: "/seo-audit" },
          { label: "On-Page SEO" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Title tag issues" value={titleIssues} icon={Type} />
          <StatCard label="Meta description issues" value={metaIssues} icon={AlignLeft} />
          <StatCard label="H1 issues" value={h1Issues} icon={Heading} />
          <StatCard label="Pages missing image alt text" value={imageIssues} icon={ImageIcon} />
        </div>
        <OnPageTable data={pages} />
      </div>
    </>
  );
}
