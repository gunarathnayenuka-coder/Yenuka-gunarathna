import type { ColumnDef } from "@tanstack/react-table";
import type { ContentAuditFinding } from "@/types";
import { SeverityBadge } from "@/components/shared/severity-badge";

/**
 * Column defs live in a plain (non "use client") file per the DataTable pattern established by
 * components/websites/columns.tsx — a Server Component cannot pass function-containing props
 * (TanStack columns) to a Client Component. `onViewContent` is bound in the "use client" wrapper.
 */
export function buildContentAuditColumns(
  contentTitleById: Map<string, string>,
  onViewContent: (contentItemId: string) => void,
): ColumnDef<ContentAuditFinding>[] {
  return [
    {
      accessorKey: "url",
      header: "Content",
      cell: ({ row }) => (
        <button type="button" onClick={() => onViewContent(row.original.contentItemId)} className="text-left hover:underline">
          <p className="max-w-70 truncate font-medium">{contentTitleById.get(row.original.contentItemId) ?? "Untitled content"}</p>
          <p className="max-w-70 truncate text-xs text-muted-foreground">{row.original.url}</p>
        </button>
      ),
    },
    {
      accessorKey: "issue",
      header: "Issue",
      cell: ({ row }) => <span className="font-medium">{row.original.issue}</span>,
    },
    {
      accessorKey: "detail",
      header: "Detail",
      cell: ({ row }) => <span className="block max-w-90 text-muted-foreground">{row.original.detail}</span>,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
  ];
}
