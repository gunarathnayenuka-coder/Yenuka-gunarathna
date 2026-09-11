import { EmptyState } from "@/components/shared";
import { PortalRecommendationCard } from "@/components/portal/recommendation-card";
import { fetchClient } from "@/lib/services/clients";
import { fetchRecommendations } from "@/lib/services/ai";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";

export default async function PortalRecommendationsPage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;
  const recommendations = await fetchRecommendations(client.primaryWebsiteId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recommendations</h1>
        <p className="text-muted-foreground">What we think will move the needle next for {client.name}.</p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState title="You're all caught up" description="No open recommendations right now — check back after the next review." />
      ) : (
        <div className="space-y-2.5">
          {recommendations.map((r) => (
            <PortalRecommendationCard key={r.id} recommendation={r} />
          ))}
        </div>
      )}
    </div>
  );
}
