import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AIRecommendationCard, EmptyState } from "@/components/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantChat } from "@/components/ai-assistant/chat";
import { aiConversations } from "@/lib/mock-data";
import { fetchConversation } from "@/lib/services/ai-conversations";
import { fetchRecommendations } from "@/lib/services/ai";
import { fetchWebsite } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function AIAssistantPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);

  const [website, recommendations, initialConversation] = await Promise.all([
    fetchWebsite(websiteId),
    fetchRecommendations(websiteId),
    fetchConversation(aiConversations[0].id),
  ]);

  const websiteDomain = website?.domain ?? "your website";

  return (
    <>
      <PageHeader
        title="AI Assistant"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "AI Assistant" }]}
        description="Ask questions about your SEO performance in plain English — AI recommends, you decide."
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <AIAssistantChat
          initialConversation={initialConversation ?? aiConversations[0]}
          conversations={aiConversations}
          websiteDomain={websiteDomain}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" /> Recommended for you
            </CardTitle>
            <CardDescription>Your highest-impact opportunities right now for {websiteDomain} — reviewed and prioritized by AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recommendations.length === 0 ? (
              <EmptyState title="No open recommendations" description="This website is in great shape. Check back after the next crawl." />
            ) : (
              recommendations.slice(0, 3).map((recommendation) => <AIRecommendationCard key={recommendation.id} recommendation={recommendation} />)
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
