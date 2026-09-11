import type { ColumnDef } from "@tanstack/react-table";
import type { GSCQueryRow } from "@/types";
import { formatCompactNumber, formatPercent, formatSignedPercent } from "@/lib/format";

/** Green when positive, red when negative — `invert` flips this for metrics where a smaller number is the good outcome (e.g. position). */
function changeTone(value: number, invert = false): string {
  const v = invert ? -value : value;
  if (v > 0) return "text-success";
  if (v < 0) return "text-critical";
  return "text-muted-foreground";
}

export const gscQueryColumns: ColumnDef<GSCQueryRow>[] = [
  {
    accessorKey: "query",
    header: "Query",
    cell: ({ row }) => <span className="block max-w-64 truncate font-medium">{row.original.query}</span>,
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
  {
    accessorKey: "clicksChangePct",
    header: "Clicks Change",
    cell: ({ row }) => (
      <span className={`font-medium tabular-nums ${changeTone(row.original.clicksChangePct)}`}>
        {formatSignedPercent(row.original.clicksChangePct)}
      </span>
    ),
  },
  {
    accessorKey: "positionChange",
    header: "Position Change",
    cell: ({ row }) => {
      const value = row.original.positionChange;
      return (
        <span className={`font-medium tabular-nums ${changeTone(value, true)}`}>
          {value > 0 ? "+" : ""}
          {value.toFixed(1)}
        </span>
      );
    },
  },
];
