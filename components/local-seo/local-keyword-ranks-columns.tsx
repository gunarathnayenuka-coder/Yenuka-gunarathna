import type { ColumnDef } from "@tanstack/react-table";
import type { LocalKeywordRank } from "@/types";
import { formatRank } from "@/lib/format";

export const localKeywordRankColumns: ColumnDef<LocalKeywordRank>[] = [
  {
    accessorKey: "keyword",
    header: "Keyword",
    cell: ({ row }) => <span className="font-medium">{row.original.keyword}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "mapPackRank",
    header: "Map Pack Rank",
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatRank(row.original.mapPackRank)}</span>,
  },
  {
    accessorKey: "organicRank",
    header: "Organic Rank",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{formatRank(row.original.organicRank)}</span>,
  },
];
