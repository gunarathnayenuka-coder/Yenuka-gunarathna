import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { Client } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { ChangeIndicator } from "@/components/shared/trend-indicator";
import { formatCompactNumber, formatDate, initials } from "@/lib/format";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <Link href={`/clients/${client.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
          <Avatar className="size-7">
            <AvatarFallback className="text-[10px]">{initials(client.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate">{client.name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{client.industry}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "seoHealthScore",
    header: "SEO Health",
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.seoHealthScore}</span>,
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
    accessorKey: "trackedKeywords",
    header: "Keywords",
    cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.trackedKeywords)}</span>,
  },
  {
    accessorKey: "openIssues",
    header: "Issues",
    cell: ({ row }) => (
      <span className={row.original.openIssues > 15 ? "font-medium text-critical" : "tabular-nums"}>
        {row.original.openIssues}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <GenericStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "lastAuditAt",
    header: "Last Audit",
    cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.lastAuditAt)}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/clients/${row.original.id}`} />}>View overview</DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/seo-audit?site=${row.original.primaryWebsiteId}`} />}>
            View SEO audit
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/reports?client=${row.original.id}`} />}>
            Generate report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Archive client</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
