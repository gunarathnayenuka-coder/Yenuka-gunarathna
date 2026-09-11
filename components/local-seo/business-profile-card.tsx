import { BadgeCheck, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBar } from "@/components/shared";
import type { LocalSEOProfile } from "@/types";

/** Google Business Profile status card: identity, verification, NAP consistency, and opening hours. */
export function BusinessProfileCard({ profile, className }: { profile: LocalSEOProfile; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Google Business Profile</CardTitle>
        <CardDescription>{profile.category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-semibold text-foreground">{profile.businessName}</p>
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>{profile.address}</span>
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="size-3.5 shrink-0" />
              {profile.phone}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
              profile.isVerified ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20",
            )}
          >
            <BadgeCheck className="size-3.5" />
            {profile.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>

        <ScoreBar label="NAP consistency" score={profile.napConsistencyScore} />

        <div className="space-y-1.5 border-t pt-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Clock className="size-3.5" /> Opening hours
          </p>
          <dl className="space-y-0.5 text-xs">
            {profile.openingHours.map((oh) => (
              <div key={oh.day} className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{oh.day}</dt>
                <dd className={oh.hours === "Closed" ? "text-muted-foreground" : "font-medium text-foreground"}>{oh.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
