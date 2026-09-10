import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { WebsitePage } from "@/types";
import { clsRating, inpRating, lcpRating } from "@/lib/mock-data/performance";
import { CwvRatingBadge } from "./cwv-rating-badge";

export const cwvColumns: ColumnDef<WebsitePage>[] = [
  {
    accessorKey: "path",
    header: "URL",
    cell: ({ row }) => (
      <Link href={row.original.url} target="_blank" className="flex items-center gap-1.5 font-medium hover:underline">
        <span className="max-w-56 truncate">{row.original.path}</span>
        <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
      </Link>
    ),
  },
  {
    accessorKey: "lcpMs",
    header: "LCP",
    cell: ({ row }) => {
      const ms = row.original.lcpMs;
      return (
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{(ms / 1000).toFixed(2)}s</span>
          <CwvRatingBadge rating={lcpRating(ms)} />
        </div>
      );
    },
  },
  {
    accessorKey: "inpMs",
    header: "INP",
    cell: ({ row }) => {
      const ms = row.original.inpMs;
      return (
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{ms}ms</span>
          <CwvRatingBadge rating={inpRating(ms)} />
        </div>
      );
    },
  },
  {
    accessorKey: "cls",
    header: "CLS",
    cell: ({ row }) => {
      const value = row.original.cls;
      return (
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{value.toFixed(2)}</span>
          <CwvRatingBadge rating={clsRating(value)} />
        </div>
      );
    },
  },
  {
    accessorKey: "loadTimeMs",
    header: "Load Time",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">{(row.original.loadTimeMs / 1000).toFixed(2)}s</span>
    ),
  },
];
