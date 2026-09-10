import type { ColumnDef } from "@tanstack/react-table";
import type { Keyword } from "@/types";
import { TrendIndicator } from "@/components/shared";
import { formatCompactNumber, formatRank } from "@/lib/format";
import { IntentBadge } from "./intent-badge";

/** Positive = moved up (rank number got smaller); null when either rank is unavailable. */
function rankDelta(k: Keyword): number | null {
  if (k.currentRank === null || k.previousRank === null) return null;
  return k.previousRank - k.currentRank;
}

export const rankingsColumns: ColumnDef<Keyword>[] = [
  {
    accessorKey: "keyword",
    header: "Keyword",
    cell: ({ row }) => <span className="block max-w-64 truncate font-medium">{row.original.keyword}</span>,
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
    id: "change",
    header: "Change",
    cell: ({ row }) => {
      const delta = rankDelta(row.original);
      if (delta === null) return <span className="text-muted-foreground">—</span>;
      if (delta === 0) return <span className="text-muted-foreground tabular-nums">0</span>;
      return (
        <span className={`font-medium tabular-nums ${delta > 0 ? "text-success" : "text-critical"}`}>
          {delta > 0 ? `+${delta}` : delta}
        </span>
      );
    },
  },
  {
    accessorKey: "trend",
    header: "Trend",
    cell: ({ row }) => <TrendIndicator trend={row.original.trend} />,
  },
  {
    accessorKey: "volume",
    header: "Volume",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.volume)}</span>,
  },
  {
    accessorKey: "intent",
    header: "Intent",
    cell: ({ row }) => <IntentBadge intent={row.original.intent} />,
  },
];
