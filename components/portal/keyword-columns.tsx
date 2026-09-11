import type { ColumnDef } from "@tanstack/react-table";
import type { Keyword } from "@/types";
import { TrendIndicator } from "@/components/shared";
import { formatCompactNumber, formatRank } from "@/lib/format";

/**
 * A simplified, client-facing set of keyword columns — no difficulty, CPC or
 * opportunity-score jargon (see `components/keywords/columns.tsx` for the
 * full agency version).
 */
export const portalKeywordColumns: ColumnDef<Keyword>[] = [
  {
    accessorKey: "keyword",
    header: "Keyword",
    cell: ({ row }) => <span className="font-medium">{row.original.keyword}</span>,
  },
  {
    accessorKey: "currentRank",
    header: "Current Rank",
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatRank(row.original.currentRank)}</span>,
  },
  {
    accessorKey: "trend",
    header: "Trend",
    cell: ({ row }) => <TrendIndicator trend={row.original.trend} />,
  },
  {
    accessorKey: "volume",
    header: "Search Volume",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{formatCompactNumber(row.original.volume)}</span>,
  },
];
