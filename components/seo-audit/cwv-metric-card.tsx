import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CoreWebVitalRating } from "@/types";
import { CwvRatingBadge } from "./cwv-rating-badge";

export function CwvMetricCard({
  label,
  value,
  threshold,
  rating,
  icon: Icon,
}: {
  label: string;
  value: string;
  threshold: string;
  rating: CoreWebVitalRating;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="size-4" />
            {label}
          </div>
          <CwvRatingBadge rating={rating} />
        </div>
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{threshold}</p>
      </CardContent>
    </Card>
  );
}
