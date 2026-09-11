"use client";

import { useMemo, useState } from "react";
import type { Backlink, BacklinkStatus } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { backlinkColumns } from "./columns";

const ALL_STATUSES = "all";
const BACKLINK_STATUSES: BacklinkStatus[] = ["active", "new", "lost", "suspicious"];
const STATUS_LABELS: Record<BacklinkStatus, string> = {
  active: "Active",
  new: "New",
  lost: "Lost",
  suspicious: "Suspicious",
};

export function BacklinksTable({
  data,
  showStatusFilter = false,
  emptyTitle = "No backlinks found",
  emptyDescription = "Try a different search term or status filter.",
}: {
  data: Backlink[];
  showStatusFilter?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);

  const filtered = useMemo(() => {
    if (statusFilter === ALL_STATUSES) return data;
    return data.filter((b) => b.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <DataTable
      columns={backlinkColumns}
      data={filtered}
      searchKey="sourceDomain"
      searchPlaceholder="Search source domains..."
      pageSize={10}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      toolbar={
        showStatusFilter ? (
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? ALL_STATUSES)}>
            <SelectTrigger size="sm" className="w-full sm:w-40">
              <SelectValue placeholder="All statuses">
                {(value: string | null) =>
                  !value || value === ALL_STATUSES ? "All statuses" : STATUS_LABELS[value as BacklinkStatus]
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
              {BACKLINK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : undefined
      }
    />
  );
}
