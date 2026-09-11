import type { ColumnDef } from "@tanstack/react-table";
import { FileText, MoreHorizontal } from "lucide-react";
import type { Client, Report } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import { ReportStatusBadge } from "./report-status-badge";
import { REPORT_TYPE_LABELS } from "./labels";

export interface ReportColumnsContext {
  clientsById: Map<string, Client>;
  onDownload: (report: Report) => void;
  onSendToClient: (report: Report) => void;
  onDuplicate: (report: Report) => void;
}

/** Column defs for the reports DataTable. `ctx` carries callbacks wired up in the client wrapper. */
export function buildReportColumns(ctx: ReportColumnsContext): ColumnDef<Report>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileText className="size-3.5 text-muted-foreground" />
          </div>
          <p className="max-w-72 truncate font-medium">{row.original.title}</p>
        </div>
      ),
    },
    {
      id: "client",
      accessorFn: (row) => ctx.clientsById.get(row.clientId)?.name ?? "Unknown client",
      header: "Client",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{ctx.clientsById.get(row.original.clientId)?.name ?? "Unknown client"}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-xs font-medium text-muted-foreground">{REPORT_TYPE_LABELS[row.original.type]}</span>,
    },
    {
      id: "dateRange",
      accessorFn: (row) => row.dateRange.to,
      header: "Date range",
      cell: ({ row }) => {
        const { from, to } = row.original.dateRange;
        return (
          <span className="text-muted-foreground">
            {formatDate(from)} – {formatDate(to)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ReportStatusBadge status={row.original.status} />,
    },
    {
      id: "generatedOrSent",
      accessorFn: (row) => row.sentAt ?? row.generatedAt ?? "",
      header: "Generated / Sent",
      cell: ({ row }) => {
        const report = row.original;
        if (report.sentAt) return <span className="text-muted-foreground">Sent {formatDate(report.sentAt)}</span>;
        if (report.generatedAt) return <span className="text-muted-foreground">Generated {formatDate(report.generatedAt)}</span>;
        return <span className="text-muted-foreground">—</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${report.title}`} />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => ctx.onDownload(report)}>Download PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => ctx.onSendToClient(report)}>Send to client</DropdownMenuItem>
              <DropdownMenuItem onClick={() => ctx.onDuplicate(report)}>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
