import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Globe, MoreHorizontal } from "lucide-react";
import type { Client, Website } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { ChangeIndicator } from "@/components/shared/trend-indicator";
import { formatCompactNumber, formatRelativeTime } from "@/lib/format";

export function buildWebsiteColumns(clientsById: Map<string, Client>): ColumnDef<Website>[] {
  return [
    {
      accessorKey: "domain",
      header: "Website",
      cell: ({ row }) => {
        const website = row.original;
        return (
          <Link href={`/websites/${website.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
            <div className="flex size-7 items-center justify-center rounded-md bg-muted">
              <Globe className="size-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate">{website.domain}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {clientsById.get(website.clientId)?.name ?? "Unknown client"}
              </p>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "seoHealthScore",
      header: "SEO Score",
      cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.seoHealthScore}</span>,
    },
    {
      accessorKey: "pagesIndexed",
      header: "Pages",
      cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.pagesIndexed)}</span>,
    },
    {
      accessorKey: "trackedKeywords",
      header: "Keywords",
      cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.trackedKeywords)}</span>,
    },
    {
      accessorKey: "organicTraffic",
      header: "Traffic",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{formatCompactNumber(row.original.organicTraffic)}</span>
          <ChangeIndicator pct={row.original.organicTrafficChangePct} />
        </div>
      ),
    },
    {
      accessorKey: "lastCrawlAt",
      header: "Last Crawl",
      cell: ({ row }) => <span className="text-muted-foreground">{formatRelativeTime(row.original.lastCrawlAt)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <GenericStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={`/websites/${row.original.id}`} />}>View overview</DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/seo-audit?site=${row.original.id}`} />}>Run audit</DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/keywords?site=${row.original.id}`} />}>View keywords</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
