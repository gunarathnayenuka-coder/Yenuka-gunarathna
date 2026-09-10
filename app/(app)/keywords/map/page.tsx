import { FileText, KeyRound, Link2, TriangleAlert } from "lucide-react";
import type { Keyword } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState, StatCard } from "@/components/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { KeywordList } from "@/components/keywords/keyword-list";
import { fetchKeywords } from "@/lib/services/keywords";
import { fetchWebsite, fetchWebsitePages } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

interface KeywordMapGroup {
  url: string;
  title: string;
  keywords: Keyword[];
}

export default async function KeywordMapPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, keywords, pages] = await Promise.all([
    fetchWebsite(websiteId),
    fetchKeywords(websiteId),
    fetchWebsitePages(websiteId),
  ]);

  const pageByUrl = new Map(pages.map((p) => [p.url, p]));
  const groupsByUrl = new Map<string, Keyword[]>();
  const unmapped: Keyword[] = [];

  for (const k of keywords) {
    if (!k.url) {
      unmapped.push(k);
      continue;
    }
    const group = groupsByUrl.get(k.url);
    if (group) group.push(k);
    else groupsByUrl.set(k.url, [k]);
  }

  const mappedGroups: KeywordMapGroup[] = [...groupsByUrl.entries()]
    .map(([url, kws]) => ({
      url,
      title: pageByUrl.get(url)?.title ?? url,
      keywords: [...kws].sort((a, b) => b.volume - a.volume),
    }))
    .sort((a, b) => b.keywords.length - a.keywords.length);

  const mappedKeywordCount = keywords.length - unmapped.length;
  const avgPerPage = mappedGroups.length ? Math.round(mappedKeywordCount / mappedGroups.length) : 0;
  const defaultOpen = unmapped.length > 0 ? ["unmapped"] : mappedGroups[0] ? [mappedGroups[0].url] : [];

  return (
    <>
      <PageHeader
        title="Keyword Map"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Keywords", href: "/keywords" }, { label: "Keyword Map" }]}
        description={website ? `Keyword-to-page mapping for ${website.domain}` : "Keyword-to-page mapping for the current website."}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Mapped pages" value={formatCompactNumber(mappedGroups.length)} icon={FileText} />
          <StatCard label="Mapped keywords" value={formatCompactNumber(mappedKeywordCount)} icon={KeyRound} />
          <StatCard
            label="Unmapped keywords"
            value={formatCompactNumber(unmapped.length)}
            icon={TriangleAlert}
            hint={unmapped.length > 0 ? "A content-gap signal" : undefined}
          />
          <StatCard label="Avg keywords / page" value={formatCompactNumber(avgPerPage)} icon={Link2} />
        </div>

        {keywords.length === 0 ? (
          <EmptyState title="No keywords tracked yet" description="Track keywords for this website to see how they map to pages." />
        ) : (
          <Card>
            <CardContent className="p-2">
              <Accordion multiple defaultValue={defaultOpen}>
                {unmapped.length > 0 && (
                  <AccordionItem value="unmapped" className="border-l-2 border-l-warning bg-warning/5 px-2">
                    <AccordionTrigger>
                      <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-2">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <TriangleAlert className="size-4 text-warning" />
                          Unmapped keywords
                        </span>
                        <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                          {unmapped.length} keyword{unmapped.length === 1 ? "" : "s"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2 text-sm text-muted-foreground">
                        No page currently targets these keywords — a content gap worth planning for.
                      </p>
                      <KeywordList keywords={unmapped} />
                    </AccordionContent>
                  </AccordionItem>
                )}

                {mappedGroups.map((group) => (
                  <AccordionItem key={group.url} value={group.url} className="px-2">
                    <AccordionTrigger>
                      <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-2 text-left">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{group.title}</p>
                          <p className="truncate text-xs font-normal text-muted-foreground">{group.url}</p>
                        </div>
                        <Badge variant="outline">
                          {group.keywords.length} keyword{group.keywords.length === 1 ? "" : "s"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <KeywordList keywords={group.keywords} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
