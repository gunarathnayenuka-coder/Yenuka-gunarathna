import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared";
import { formatRelativeTime, initials } from "@/lib/format";
import type { LocalReview } from "@/types";
import { StarRating } from "./star-rating";

const PLATFORM_LABELS: Record<LocalReview["platform"], string> = {
  google: "Google",
  facebook: "Facebook",
  yelp: "Yelp",
};

export function ReviewsList({ reviews }: { reviews: LocalReview[] }) {
  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Customer reviews will appear here once collected." />;
  }

  return (
    <div className="divide-y">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <Avatar size="sm" className="mt-0.5 shrink-0">
            <AvatarFallback>{initials(review.author)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{review.author}</p>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(review.postedAt)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            <div className="flex items-center gap-3 pt-0.5 text-xs text-muted-foreground">
              <span>{PLATFORM_LABELS[review.platform]}</span>
              {review.hasResponse ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <MessageCircle className="size-3.5" /> Responded
                </span>
              ) : (
                <span>No response yet</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
