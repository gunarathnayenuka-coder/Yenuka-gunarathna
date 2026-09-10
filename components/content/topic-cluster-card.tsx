import Link from "next/link";
import { cn } from "cn";
import { ExternalLink } from "lucide-react";
import type { ContentItem, TopicCluster } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBar } from "@/components/shared";
import { formatCompactNumber } from "@/lib/format";
import { ContentStatusBadge } from "./content-status-badge";

const STATUS_STYLES: Record<TopicCluster["status"], { label: string; badgeClass: string; borderClass: string }> = {
  strong: { label: "Strong", badgeClass: "bg-success/10 text-success border-success/20", borderClass: "" },
  developing: { label: "Developing", badgeClass: "bg-info/10 text-info border-info/20", borderClass: "" },
  weak: {
    label: "Needs attention",
    badgeClass: "bg-critical/10 text-critical border-critical/20",
    borderClass: "border-l-4 border-l-critical",
  },
};

/** A cluster with status "weak" gets a critical-colored left border so it stands out as the actionable one. */
export function TopicClusterCard({ cluster, supportingItems }: { cluster: TopicCluster; supportingItems: ContentItem[] }) {
  const style = STATUS_STYLES[cluster.status];
  return (
    <Card className={cn(style.borderClass)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{cluster.name}</CardTitle>
          <span className={cn("inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium", style.badgeClass)}>
            {style.label}
          </span>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Link href={cluster.pillarUrl} target="_blank" className="truncate hover:underline">
            {cluster.pillarUrl}
          </Link>
          <ExternalLink className="size-3 shrink-0" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScoreBar label="Coverage score" score={cluster.coverageScore} />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{formatCompactNumber(cluster.totalVolume)}</span> monthly search volume ·{" "}
          <span className="font-medium text-foreground">{supportingItems.length}</span> supporting page
          {supportingItems.length === 1 ? "" : "s"}
        </p>
        {supportingItems.length > 0 ? (
          <ul className="space-y-1.5">
            {supportingItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-sm">
                <span className="truncate">{item.title}</span>
                <ContentStatusBadge status={item.status} className="shrink-0" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No supporting content linked to this cluster yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
