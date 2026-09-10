import { PageHeader } from "@/components/layout/page-header";
import { ContentWriterPanel } from "@/components/content/content-writer-panel";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchWebsite, fetchWebsitePages } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function ContentWriterPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, keywords, pages] = await Promise.all([
    fetchWebsite(websiteId),
    fetchKeywords(websiteId),
    fetchWebsitePages(websiteId),
  ]);

  const suggestedKeywords = [...keywords]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 8)
    .map((keyword) => keyword.keyword);
  const internalLinkSuggestions = pages
    .filter((page) => page.statusCode === 200)
    .slice(0, 8)
    .map((page) => page.url);

  return (
    <>
      <PageHeader
        title="AI Writer"
        description={`Generate SEO-optimized outlines and drafts for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Content", href: "/content" }, { label: "AI Writer" }]}
      />
      <div className="flex-1 p-4 md:p-6">
        <ContentWriterPanel
          websiteDomain={website?.domain ?? "your website"}
          suggestedKeywords={suggestedKeywords}
          internalLinkSuggestions={internalLinkSuggestions}
        />
      </div>
    </>
  );
}
