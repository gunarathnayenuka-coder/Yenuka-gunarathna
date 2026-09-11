"use client";

import { History } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatRelativeTime } from "@/lib/format";
import type { AutomationRule, AutomationRun } from "@/types";
import { TRIGGER_LABELS } from "./labels";

/**
 * Full run-history side panel for one automation rule. Runs are pre-fetched
 * server-side and passed in — this component only manages open/close state.
 */
export function RunHistorySheet({
  rule,
  runs,
  onOpenChange,
}: {
  rule: AutomationRule | null;
  runs: AutomationRun[];
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={rule !== null} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {rule && (
          <>
            <SheetHeader>
              <span className="text-xs text-muted-foreground">{TRIGGER_LABELS[rule.trigger]}</span>
              <SheetTitle>{rule.name}</SheetTitle>
              <SheetDescription>{rule.description}</SheetDescription>
            </SheetHeader>

            <div className="space-y-3 px-4">
              {runs.length === 0 ? (
                <EmptyState icon={History} title="No runs yet" description="This automation hasn't run yet." className="border-none py-10" />
              ) : (
                runs.map((run) => (
                  <div key={run.id} className="space-y-1.5 rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">
                        {formatDate(run.startedAt, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </span>
                      <GenericStatusBadge status={run.status} />
                    </div>
                    {run.summary && <p className="text-muted-foreground">{run.summary}</p>}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {run.itemsProcessed !== undefined && <span>{run.itemsProcessed.toLocaleString()} items processed</span>}
                      <span>{formatRelativeTime(run.startedAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {runs.length > 0 && (
              <SheetFooter>
                <p className="text-xs text-muted-foreground">
                  Showing the last {runs.length} run{runs.length === 1 ? "" : "s"}.
                </p>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
