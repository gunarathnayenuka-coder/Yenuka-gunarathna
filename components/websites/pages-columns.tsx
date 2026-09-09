import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import type { WebsitePage } from "@/types";
import { GenericStatusBadge } from "@/components/shared/status-badge";

export const websitePageColumns: ColumnDef<WebsitePage>[] = [
  {
    accessorKey: "path",
    header: "URL",
    cell: ({ row }) => (
      <Link href={row.original.url} target="_blank" className="flex items-center gap-1.5 font-medium hover:underline">
        <span className="max-w-70 truncate">{row.original.path}</span>
        <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
      </Link>
    ),
  },
  {
    accessorKey: "statusCode",
    header: "Status",
    cell: ({ row }) => (
      <span className={row.original.statusCode >= 400 ? "font-medium text-critical" : "text-muted-foreground"}>
        {row.original.statusCode}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="block max-w-50 truncate">{row.original.title}</span>,
  },
  {
    accessorKey: "wordCount",
    header: "Words",
    cell: ({ row }) => <span className="tabular-nums">{row.original.wordCount}</span>,
  },
  {
    accessorKey: "seoScore",
    header: "SEO Score",
    cell: ({ row }) => {
      const score = row.original.seoScore;
      return (
        <span className={score < 60 ? "font-medium text-critical" : score < 80 ? "font-medium text-warning" : "font-medium text-success"}>
          {score}
        </span>
      );
    },
  },
  {
    accessorKey: "indexStatus",
    header: "Index Status",
    cell: ({ row }) => <GenericStatusBadge status={row.original.indexStatus} />,
  },
];
