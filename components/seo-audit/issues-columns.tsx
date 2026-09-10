import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import type { SEOIssue, SEOIssueCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";

export const ISSUE_CATEGORY_LABELS: Record<SEOIssueCategory, string> = {
  technical: "Technical",
  on_page: "On-Page",
  performance: "Performance",
  schema: "Schema",
  internal_linking: "Internal Linking",
  mobile: "Mobile",
  content: "Content",
};

/** Column defs for the issues DataTable. `onView` opens the row's detail sheet in the client wrapper. */
export function buildIssueColumns(onView: (issue: SEOIssue) => void): ColumnDef<SEOIssue>[] {
  return [
    {
      accessorKey: "title",
      header: "Issue",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="max-w-64 truncate text-left font-medium hover:underline"
        >
          {row.original.title}
        </button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-muted-foreground">{ISSUE_CATEGORY_LABELS[row.original.category]}</span>,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => <span className="block max-w-48 truncate text-muted-foreground">{row.original.url}</span>,
    },
    {
      accessorKey: "affectedPages",
      header: "Affected Pages",
      cell: ({ row }) => <span className="tabular-nums">{row.original.affectedPages}</span>,
    },
    {
      accessorKey: "detectedAt",
      header: "Detected",
      cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.detectedAt)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => onView(row.original)}>
          <Eye /> View
        </Button>
      ),
    },
  ];
}
