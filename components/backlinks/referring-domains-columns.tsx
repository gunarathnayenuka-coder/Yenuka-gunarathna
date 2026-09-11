import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { ReferringDomain } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { RelevanceBadge } from "./relevance-badge";

/** Green/amber/red tone for a 0-100 score. */
function scoreTone(value: number): string {
  if (value >= 75) return "text-success";
  if (value >= 50) return "text-warning";
  return "text-critical";
}

export const referringDomainColumns: ColumnDef<ReferringDomain>[] = [
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) => {
      const domain = row.original;
      return (
        <Link
          href={`https://${domain.domain}`}
          target="_blank"
          className="inline-flex max-w-56 items-center gap-1 font-medium hover:underline"
        >
          <span className="truncate">{domain.domain}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
        </Link>
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
    accessorKey: "backlinksCount",
    header: "Backlinks",
    cell: ({ row }) => <span className="tabular-nums">{row.original.backlinksCount}</span>,
  },
  {
    accessorKey: "relevance",
    header: "Relevance",
    cell: ({ row }) => <RelevanceBadge relevance={row.original.relevance} />,
  },
  {
    accessorKey: "isNew",
    header: "New",
    cell: ({ row }) => (row.original.isNew ? <Badge>New</Badge> : <span className="text-muted-foreground">—</span>),
  },
  {
    accessorKey: "firstSeenAt",
    header: "First Seen",
    cell: ({ row }) => <span className="text-muted-foreground">{formatRelativeTime(row.original.firstSeenAt)}</span>,
  },
];
