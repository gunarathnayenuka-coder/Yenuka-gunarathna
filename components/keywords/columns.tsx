import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { Keyword } from "@/types";
import { TrendIndicator } from "@/components/shared";
import { formatCompactNumber, formatRank } from "@/lib/format";
import { IntentBadge } from "./intent-badge";

/** Green/amber/red tone for a 0-100 score. `invert` when a lower value is the good outcome (e.g. difficulty). */
function scoreTone(value: number, invert = false): string {
  const good = invert ? value <= 30 : value >= 75;
  const warn = invert ? value <= 60 : value >= 50;
  if (good) return "text-success";
  if (warn) return "text-warning";
  return "text-critical";
}

export const keywordColumns: ColumnDef<Keyword>[] = [
  {
    accessorKey: "keyword",
    header: "Keyword",
    cell: ({ row }) => {
      const k = row.original;
      return (
        <div className="min-w-0">
          <p className="max-w-64 truncate font-medium">{k.keyword}</p>
          {k.tags.length > 0 && <p className="truncate text-xs text-muted-foreground">{k.tags.join(", ")}</p>}
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
    accessorKey: "cpc",
    header: "CPC",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">${row.original.cpc.toFixed(2)}</span>,
  },
  {
    accessorKey: "currentRank",
    header: "Current Rank",
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatRank(row.original.currentRank)}</span>,
  },
  {
    accessorKey: "previousRank",
    header: "Previous Rank",
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{formatRank(row.original.previousRank)}</span>,
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.original.url;
      if (!url) return <span className="text-xs text-muted-foreground italic">Not mapped</span>;
      let path = url;
      try {
        path = new URL(url).pathname || "/";
      } catch {
        // Keep the raw value if it's not a fully-qualified URL.
      }
      return (
        <Link href={url} target="_blank" className="inline-flex max-w-48 items-center gap-1 hover:underline">
          <span className="truncate">{path}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
        </Link>
      );
    },
  },
  {
    accessorKey: "trend",
    header: "Trend",
    cell: ({ row }) => <TrendIndicator trend={row.original.trend} />,
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
];
