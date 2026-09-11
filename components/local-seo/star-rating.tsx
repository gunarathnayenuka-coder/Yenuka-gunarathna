import { Star } from "lucide-react";
import { cn } from "cn";

/** Simple filled/unfilled star row for a 0-5 rating (rounded to the nearest whole star). */
export function StarRating({ rating, size = "sm", className }: { rating: number; size?: "sm" | "md"; className?: string }) {
  const filled = Math.round(rating);
  const starClass = size === "md" ? "size-4" : "size-3.5";

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn(starClass, i < filled ? "fill-warning text-warning" : "fill-none text-muted-foreground")} />
      ))}
    </span>
  );
}
