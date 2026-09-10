import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { cn } from "cn";
import type { WebsitePage } from "@/types";
import { formatCompactNumber } from "@/lib/format";
import { countOnPageIssues, getOnPageFlags } from "./on-page-issues";

function flagClass(bad: boolean): string {
  return bad ? "font-medium text-critical" : "text-muted-foreground";
}

export const onPageColumns: ColumnDef<WebsitePage>[] = [
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
    accessorKey: "titleLength",
    header: "Title",
    cell: ({ row }) => {
      const flags = getOnPageFlags(row.original);
      return (
        <div className="max-w-48">
          <p className="truncate text-foreground">{row.original.title}</p>
          <span className={cn("text-xs", flagClass(flags.titleIssue))}>{row.original.titleLength} chars</span>
        </div>
      );
    },
  },
  {
    accessorKey: "metaDescriptionLength",
    header: "Meta Description",
    cell: ({ row }) => {
      const flags = getOnPageFlags(row.original);
      const length = row.original.metaDescriptionLength;
      return <span className={flagClass(flags.metaDescriptionIssue)}>{length === 0 ? "Missing" : `${length} chars`}</span>;
    },
  },
  {
    accessorKey: "h1Count",
    header: "H1",
    cell: ({ row }) => {
      const flags = getOnPageFlags(row.original);
      return <span className={cn("tabular-nums", flagClass(flags.h1Issue))}>{row.original.h1Count}</span>;
    },
  },
  {
    accessorKey: "wordCount",
    header: "Content",
    cell: ({ row }) => (
      <span className={cn("tabular-nums", flagClass(row.original.wordCount < 300))}>
        {formatCompactNumber(row.original.wordCount)} words
      </span>
    ),
  },
  {
    accessorKey: "imagesMissingAlt",
    header: "Images",
    cell: ({ row }) => {
      const { imagesTotal, imagesMissingAlt } = row.original;
      return (
        <span className={flagClass(imagesMissingAlt > 0)}>
          {imagesTotal} total{imagesMissingAlt > 0 ? ` · ${imagesMissingAlt} missing alt` : ""}
        </span>
      );
    },
  },
  {
    id: "internalLinks",
    header: "Internal Links",
    accessorFn: (page) => page.internalLinksIn + page.internalLinksOut,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.internalLinksIn} in · {row.original.internalLinksOut} out
      </span>
    ),
  },
  {
    accessorKey: "externalLinks",
    header: "External Links",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.externalLinks}</span>,
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
    id: "onPageIssues",
    header: "Issues",
    accessorFn: (page) => countOnPageIssues(page),
    cell: ({ row }) => {
      const count = countOnPageIssues(row.original);
      return count === 0 ? (
        <span className="text-success">None</span>
      ) : (
        <span className="font-medium text-critical">
          {count} issue{count === 1 ? "" : "s"}
        </span>
      );
    },
  },
];
