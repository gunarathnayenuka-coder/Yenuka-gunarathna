import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { GA4LandingPage } from "@/types";
import { formatCompactNumber, formatPercent, formatSignedPercent } from "@/lib/format";

function changeTone(value: number): string {
  if (value > 0) return "text-success";
  if (value < 0) return "text-critical";
  return "text-muted-foreground";
}

export const ga4LandingPageColumns: ColumnDef<GA4LandingPage>[] = [
  {
    accessorKey: "url",
    header: "Landing Page",
    cell: ({ row }) => {
      const url = row.original.url;
      let path = url;
      try {
        path = new URL(url).pathname || "/";
      } catch {
        // Keep the raw value if it's not a fully-qualified URL.
      }
      return (
        <Link href={url} target="_blank" className="inline-flex max-w-64 items-center gap-1 font-medium hover:underline">
          <span className="truncate">{path}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
        </Link>
      );
    },
  },
  {
    accessorKey: "sessions",
    header: "Sessions",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.sessions)}</span>,
  },
  {
    accessorKey: "organicSessions",
    header: "Organic Sessions",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{formatCompactNumber(row.original.organicSessions)}</span>,
  },
  {
    accessorKey: "conversions",
    header: "Conversions",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.conversions)}</span>,
  },
  {
    accessorKey: "engagementRate",
    header: "Engagement Rate",
    cell: ({ row }) => <span className="tabular-nums">{formatPercent(row.original.engagementRate)}</span>,
  },
  {
    accessorKey: "changePct",
    header: "Change",
    cell: ({ row }) => (
      <span className={`font-medium tabular-nums ${changeTone(row.original.changePct)}`}>{formatSignedPercent(row.original.changePct)}</span>
    ),
  },
];
