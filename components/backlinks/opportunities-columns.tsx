import { useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { cn } from "cn";
import { ExternalLink, StickyNote } from "lucide-react";
import type { LinkOpportunity } from "@/types";
import { Button } from "@/components/ui/button";
import { RelevanceBadge } from "./relevance-badge";

/** Green/amber/red tone for a 0-100 score. */
function scoreTone(value: number): string {
  if (value >= 75) return "text-success";
  if (value >= 50) return "text-warning";
  return "text-critical";
}

const OPPORTUNITY_STATUS_CONFIG: Record<LinkOpportunity["status"], { label: string; className: string }> = {
  identified: { label: "Identified", className: "bg-muted text-muted-foreground border-border" },
  in_outreach: { label: "In Outreach", className: "bg-info/10 text-info border-info/20" },
  acquired: { label: "Acquired", className: "bg-success/10 text-success border-success/20" },
  declined: { label: "Declined", className: "bg-critical/10 text-critical border-critical/20" },
};

function OpportunityStatusBadge({ status }: { status: LinkOpportunity["status"] }) {
  const config = OPPORTUNITY_STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap", config.className)}>
      {config.label}
    </span>
  );
}

/**
 * This is a discovery list for human-led outreach, not an automated link-building/link-buying
 * tool — actions stay "mark for outreach" / "add a note", never "auto-acquire". Toast-only, no backend.
 */
function OutreachActions({ opportunity }: { opportunity: LinkOpportunity }) {
  const [markedForOutreach, setMarkedForOutreach] = useState(
    opportunity.status === "in_outreach" || opportunity.status === "acquired",
  );

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        size="sm"
        variant={markedForOutreach ? "outline" : "default"}
        disabled={markedForOutreach}
        onClick={() => {
          setMarkedForOutreach(true);
          toast.success(`${opportunity.targetDomain} marked for outreach.`);
        }}
      >
        {markedForOutreach ? "Marked for outreach" : "Mark for outreach"}
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Add note"
        onClick={() => toast.info(`Note added for ${opportunity.targetDomain}.`)}
      >
        <StickyNote />
      </Button>
    </div>
  );
}

export const linkOpportunityColumns: ColumnDef<LinkOpportunity>[] = [
  {
    accessorKey: "targetDomain",
    header: "Target Domain",
    cell: ({ row }) => {
      const opportunity = row.original;
      return (
        <div className="min-w-0">
          <Link
            href={`https://${opportunity.targetDomain}`}
            target="_blank"
            className="inline-flex items-center gap-1 font-medium hover:underline"
          >
            <span className="truncate">{opportunity.targetDomain}</span>
            <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
          </Link>
          <p className="max-w-72 truncate text-xs text-muted-foreground">{opportunity.reason}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "domainRating",
    header: "DR",
    cell: ({ row }) => (
      <span className={`font-medium tabular-nums ${scoreTone(row.original.domainRating)}`}>{row.original.domainRating}</span>
    ),
  },
  {
    accessorKey: "relevance",
    header: "Relevance",
    cell: ({ row }) => <RelevanceBadge relevance={row.original.relevance} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OpportunityStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <OutreachActions opportunity={row.original} />,
  },
];
