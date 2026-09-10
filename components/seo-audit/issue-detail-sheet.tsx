"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatRelativeTime } from "@/lib/format";
import type { SEOIssue } from "@/types";
import { ISSUE_CATEGORY_LABELS } from "./issues-columns";

/**
 * Full-detail side panel for one issue. This is a frontend-only phase — every
 * action below just confirms with a toast, nothing is persisted.
 */
export function IssueDetailSheet({
  issue,
  onOpenChange,
}: {
  issue: SEOIssue | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={issue !== null} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {issue && (
          <>
            <SheetHeader>
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={issue.severity} />
                <StatusBadge status={issue.status} />
                <span className="text-xs text-muted-foreground">{ISSUE_CATEGORY_LABELS[issue.category]}</span>
              </div>
              <SheetTitle>{issue.title}</SheetTitle>
              <SheetDescription>{issue.url}</SheetDescription>
            </SheetHeader>

            <div className="space-y-4 px-4 text-sm">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Description</p>
                <p className="text-foreground">{issue.description}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Recommendation</p>
                <p className="text-foreground">{issue.recommendation}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Affected pages</p>
                  <p className="font-medium text-foreground">{issue.affectedPages}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Detected</p>
                  <p className="font-medium text-foreground">{formatRelativeTime(issue.detectedAt)}</p>
                </div>
                {issue.resolvedAt && (
                  <div>
                    <p className="text-muted-foreground">Resolved</p>
                    <p className="font-medium text-foreground">{formatDate(issue.resolvedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => toast.success(`AI fix drafted for "${issue.title}".`)}>
                Generate Fix
              </Button>
              <Button variant="outline" onClick={() => toast.success(`"${issue.title}" assigned to a team member.`)}>
                Assign
              </Button>
              <Button onClick={() => toast.success(`"${issue.title}" marked as resolved.`)}>Mark resolved</Button>
              <Button variant="ghost" onClick={() => toast.info(`"${issue.title}" ignored.`)}>
                Ignore
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
