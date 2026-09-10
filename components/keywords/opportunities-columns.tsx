import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { KeywordOpportunity } from "@/types";
import { formatCompactNumber, formatRank } from "@/lib/format";
import { IntentBadge } from "./intent-badge";
import { SuggestedActionBadge } from "./suggested-action";

/** Green/amber/red tone for a 0-100 score. `invert` when a lower value is the good outcome (e.g. difficulty). */
function scoreTone(value: number, invert = false): string {
  const good = invert ? value <= 30 : value >= 75;
  const warn = invert ? value <= 60 : value >= 50;
  if (good) return "text-success";
  if (warn) return "text-warning";
  return "text-critical";
}

export const opportunityColumns: ColumnDef<KeywordOpportunity>[] = [
  {
    accessorKey: "keyword",
    header: "Keyword",
    cell: ({ row }) => {
      const o = row.original;
      return (
        <div className="min-w-0">
          <p className="max-w-72 truncate font-medium">{o.keyword}</p>
          <p className="max-w-72 truncate text-xs text-muted-foreground">{o.reason}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "intent",
    header: "Intent",
    cell: ({ row }) => <IntentBadge intent={row.original.intent} />,
  },
  {
    accessorKey: "volume",
    header: "Volume",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.volume)}</span>,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <span className={`font-medium tabular-nums ${scoreTone(row.original.difficulty, true)}`}>{row.original.difficulty}</span>
    ),
  },
  {
    accessorKey: "currentRank",
    header: "Current Rank",
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatRank(row.original.currentRank)}</span>,
  },
  {
    accessorKey: "opportunityScore",
    header: "Opportunity",
    cell: ({ row }) => (
      <span className={`font-semibold tabular-nums ${scoreTone(row.original.opportunityScore)}`}>
        {row.original.opportunityScore}
      </span>
    ),
  },
  {
    accessorKey: "suggestedAction",
    header: "Suggested Action",
    cell: ({ row }) => <SuggestedActionBadge action={row.original.suggestedAction} />,
  },
  {
    id: "page",
    cell: ({ row }) => {
      const url = row.original.suggestedUrl;
      if (!url) return null;
      return (
        <Link href={url} target="_blank" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline">
          <ExternalLink className="size-3.5" />
        </Link>
      );
    },
  },
];
