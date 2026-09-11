import { Camera, MapPin, Megaphone, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, EmptyState } from "@/components/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfileCard } from "@/components/local-seo/business-profile-card";
import { LocalKeywordRanksTable } from "@/components/local-seo/local-keyword-ranks-table";
import { ReviewsList } from "@/components/local-seo/reviews-list";
import { LocationPagesTable } from "@/components/local-seo/location-pages-table";
import { fetchLocalKeywordRanks, fetchLocalProfile, fetchLocalReviews, fetchLocationPages } from "@/lib/services/local-seo";
import { fetchWebsite } from "@/lib/services/websites";
import { formatCompactNumber } from "@/lib/format";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function LocalSEOPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);
  const [website, profile, keywordRanks, reviews, locationPages] = await Promise.all([
    fetchWebsite(websiteId),
    fetchLocalProfile(websiteId),
    fetchLocalKeywordRanks(websiteId),
    fetchLocalReviews(websiteId),
    fetchLocationPages(websiteId),
  ]);

  return (
    <>
      <PageHeader
        title="Local SEO"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Local SEO" }]}
        description={
          website
            ? `Google Business Profile and local search performance for ${website.domain}`
            : "Google Business Profile and local search performance for the current website."
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        {!profile ? (
          <EmptyState
            title="No Google Business Profile connected"
            description="Connect a Google Business Profile to see local SEO performance here."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <BusinessProfileCard profile={profile} className="lg:col-span-1" />
              <div className="grid grid-cols-2 content-start gap-3 lg:col-span-2">
                <StatCard
                  label="Average rating"
                  value={profile.averageRating.toFixed(1)}
                  hint={`${formatCompactNumber(profile.totalReviews)} reviews`}
                  changePct={profile.reviewsChangePct}
                  icon={Star}
                />
                <StatCard
                  label="Map pack visibility"
                  value={`${profile.mapPackVisibilityPct}%`}
                  hint="Tracked local keywords appearing in the map pack"
                  icon={MapPin}
                />
                <StatCard label="Photos" value={formatCompactNumber(profile.photosCount)} icon={Camera} />
                <StatCard label="Posts (last 30 days)" value={profile.postsLast30Days} icon={Megaphone} />
              </div>
            </div>

            <LocalKeywordRanksTable data={keywordRanks} />

            <Card>
              <CardHeader>
                <CardTitle>Customer reviews</CardTitle>
                <CardDescription>Recent reviews across connected platforms.</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsList reviews={reviews} />
              </CardContent>
            </Card>

            {locationPages.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Location pages</CardTitle>
                  <CardDescription>SEO score and NAP consistency for each location page.</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationPagesTable data={locationPages} />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
}
