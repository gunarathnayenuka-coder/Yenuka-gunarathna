import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { Backlink } from "@/types";
import { formatRelativeTime } from "@/lib/format";
import { BacklinkStatusBadge } from "./backlink-status-badge";
import { LinkTypeBadge } from "./link-type-badge";

/** Green/amber/red tone for a 0-100 score. */
function scoreTone(value: number): string {
  if (value >= 75) return "text-success";
  if (value >= 50) return "text-warning";
  return "text-critical";
}

export const backlinkColumns: ColumnDef<Backlink>[] = [
  {
    accessorKey: "sourceDomain",
    header: "Source",
    cell: ({ row }) => {
      const backlink = row.original;
      return (
        <Link
          href={backlink.sourceUrl}
          target="_blank"
          className="inline-flex max-w-56 items-center gap-1 font-medium hover:underline"
        >
          <span className="truncate">{backlink.sourceDomain}</span>
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
    accessorKey: "anchorText",
    header: "Anchor Text",
    cell: ({ row }) => <span className="block max-w-52 truncate text-muted-foreground">{row.original.anchorText}</span>,
  },
  {
    accessorKey: "targetUrl",
    header: "Target Page",
    cell: ({ row }) => {
      const url = row.original.targetUrl;
      let path = url;
      try {
        path = new URL(url).pathname || "/";
      } catch {
        // Keep the raw value if it's not a fully-qualified URL.
      }
      return (
        <Link href={url} target="_blank" className="inline-flex max-w-44 items-center gap-1 hover:underline">
          <span className="truncate">{path}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
        </Link>
      );
    },
  },
  {
    accessorKey: "linkType",
    header: "Link Type",
    cell: ({ row }) => <LinkTypeBadge type={row.original.linkType} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <BacklinkStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "firstSeenAt",
    header: "First Seen",
    cell: ({ row }) => <span className="text-muted-foreground">{formatRelativeTime(row.original.firstSeenAt)}</span>,
  },
];
