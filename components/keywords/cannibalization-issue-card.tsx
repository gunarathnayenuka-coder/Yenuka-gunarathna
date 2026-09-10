import Link from "next/link";
import { cn } from "cn";
import { ExternalLink } from "lucide-react";
import type { CannibalizationIssue } from "@/types";
import { SeverityBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRank, formatRelativeTime } from "@/lib/format";

export function CannibalizationIssueCard({ issue }: { issue: CannibalizationIssue }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{issue.keyword}</CardTitle>
        <CardDescription>
          {issue.urls.length} competing pages · Detected {formatRelativeTime(issue.detectedAt)}
        </CardDescription>
        <CardAction>
          <SeverityBadge severity={issue.severity} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {issue.urls.map((u) => {
            const isPrimary = u.url === issue.recommendedPrimaryUrl;
            return (
              <div
                key={u.url}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-2.5 text-sm",
                  isPrimary && "border-success/40 bg-success/5",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{u.title}</p>
                  <Link
                    href={u.url}
                    target="_blank"
                    className="inline-flex max-w-full items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    <span className="truncate">{u.url}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </Link>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {isPrimary && (
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                      Recommended primary
                    </Badge>
                  )}
                  <span className="text-sm font-medium tabular-nums">{formatRank(u.rank)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg bg-muted/40 p-3 text-sm">
          <p className="font-medium text-foreground">Recommendation</p>
          <p className="text-muted-foreground">{issue.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
