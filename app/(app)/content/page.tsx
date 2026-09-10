import Link from "next/link";
import { CheckCircle2, FileText, PenSquare, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentStatusBreakdown } from "@/components/content/content-status-breakdown";
import { RecentContentList } from "@/components/content/recent-content-list";
import { users } from "@/lib/mock-data";
import { REFERENCE_NOW } from "@/lib/mock-data/rng";
import { fetchContentBriefs, fetchContentItems } from "@/lib/services/content";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function ContentDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, items, briefs] = await Promise.all([
    fetchWebsite(websiteId),
    fetchContentItems(websiteId),
    fetchContentBriefs(websiteId),
  ]);

  const referenceNow = new Date(REFERENCE_NOW);
  const publishedThisMonth = items.filter((item) => {
    if (item.status !== "published" || !item.publishedAt) return false;
    const publishedAt = new Date(item.publishedAt);
    return publishedAt.getUTCFullYear() === referenceNow.getUTCFullYear() && publishedAt.getUTCMonth() === referenceNow.getUTCMonth();
  }).length;
  const inReview = items.filter((item) => item.status === "review").length;
  const seoScores = items.map((item) => item.seoScore).filter((score): score is number => score !== null);
  const avgSeoScore = seoScores.length > 0 ? Math.round(seoScores.reduce((sum, score) => sum + score, 0) / seoScores.length) : null;

  const authorsById = Object.fromEntries(users.map((user) => [user.id, user.name]));
  const recentItems = [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);

  return (
    <>
      <PageHeader
        title="Content Dashboard"
        description={`Content pipeline overview for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Content" }]}
        actions={
          <Button render={<Link href={`/content/writer?site=${websiteId}`} />}>
            <Sparkles /> Open AI Writer
          </Button>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total content items" value={items.length} icon={FileText} />
          <StatCard label="Published this month" value={publishedThisMonth} icon={CheckCircle2} />
          <StatCard label="In review" value={inReview} icon={PenSquare} />
          <StatCard label="Average SEO score" value={avgSeoScore ?? "—"} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Content by status</CardTitle>
            <CardDescription>Where every piece of content on this website currently sits</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" render={<Link href={`/content/planner?site=${websiteId}`} />}>
                Open planner
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ContentStatusBreakdown items={items} websiteId={websiteId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently updated</CardTitle>
            <CardDescription>Click an item to see its full details</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentContentList items={recentItems} briefs={briefs} authorsById={authorsById} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
