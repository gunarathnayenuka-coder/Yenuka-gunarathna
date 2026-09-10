import type { ContentItem } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared";
import { TopicClusterCard } from "@/components/content/topic-cluster-card";
import { fetchContentItems, fetchTopicClusters } from "@/lib/services/content";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function TopicClustersPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, clusters, items] = await Promise.all([
    fetchWebsite(websiteId),
    fetchTopicClusters(websiteId),
    fetchContentItems(websiteId),
  ]);
  const itemsById = new Map(items.map((item) => [item.id, item]));

  return (
    <>
      <PageHeader
        title="Topic Clusters"
        description={`Pillar-and-cluster content coverage for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Content", href: "/content" }, { label: "Topic Clusters" }]}
      />
      <div className="flex-1 p-4 md:p-6">
        {clusters.length === 0 ? (
          <EmptyState title="No topic clusters yet" description="Topic clusters group related content around a shared pillar page." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clusters.map((cluster) => (
              <TopicClusterCard
                key={cluster.id}
                cluster={cluster}
                supportingItems={cluster.supportingContentIds
                  .map((id) => itemsById.get(id))
                  .filter((item): item is ContentItem => item !== undefined)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
