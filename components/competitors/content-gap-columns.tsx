import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { CompetitorContentGap } from "@/types";
import { formatCompactNumber } from "@/lib/format";

export const contentGapColumns: ColumnDef<CompetitorContentGap>[] = [
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => (
      <Link
        href={row.original.competitorUrl}
        target="_blank"
        className="inline-flex max-w-72 items-center gap-1 font-medium hover:underline"
      >
        <span className="truncate">{row.original.topic}</span>
        <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
      </Link>
    ),
  },
  {
    accessorKey: "competitorDomain",
    header: "Covered By",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.competitorDomain}</span>,
  },
  {
    accessorKey: "estTraffic",
    header: "Est. Traffic",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.estTraffic)}</span>,
  },
  {
    accessorKey: "targetKeywords",
    header: "Target Keywords",
    cell: ({ row }) => (
      <span className="block max-w-64 truncate text-muted-foreground" title={row.original.targetKeywords.join(", ")}>
        {row.original.targetKeywords.join(", ")}
      </span>
    ),
  },
  {
    accessorKey: "weCoverTopic",
    header: "Coverage",
    cell: ({ row }) =>
      row.original.weCoverTopic ? (
        <span className="inline-flex items-center rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-success">
          We cover this
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md border border-critical/20 bg-critical/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-critical">
          Gap — not covered
        </span>
      ),
  },
];
