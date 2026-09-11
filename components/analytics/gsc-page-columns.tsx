import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { GSCPageRow } from "@/types";
import { formatCompactNumber, formatPercent } from "@/lib/format";

export const gscPageColumns: ColumnDef<GSCPageRow>[] = [
  {
    accessorKey: "url",
    header: "Page",
    cell: ({ row }) => {
      const url = row.original.url;
      let path = url;
      try {
        path = new URL(url).pathname || "/";
      } catch {
        // Keep the raw value if it's not a fully-qualified URL.
      }
      return (
        <Link href={url} target="_blank" className="inline-flex max-w-72 items-center gap-1 font-medium hover:underline">
          <span className="truncate">{path}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
        </Link>
      );
    },
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.clicks)}</span>,
  },
  {
    accessorKey: "impressions",
    header: "Impressions",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{formatCompactNumber(row.original.impressions)}</span>,
  },
  {
    accessorKey: "ctr",
    header: "CTR",
    cell: ({ row }) => <span className="tabular-nums">{formatPercent(row.original.ctr)}</span>,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.position.toFixed(1)}</span>,
  },
];
