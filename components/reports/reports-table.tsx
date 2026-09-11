"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { Client, Report } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildReportColumns } from "./columns";

const ALL_CLIENTS = "all";

export function ReportsTable({ data, clients }: { data: Report[]; clients: Client[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeClientId = searchParams.get("client") ?? ALL_CLIENTS;

  const clientsById = useMemo(() => new Map(clients.map((c) => [c.id, c])), [clients]);

  const handleClientChange = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === ALL_CLIENTS) {
        params.delete("client");
      } else {
        params.set("client", value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const handleDownload = useCallback((report: Report) => {
    toast.success(`"${report.title}" — PDF download started.`);
  }, []);

  const handleSendToClient = useCallback(
    (report: Report) => {
      const client = clientsById.get(report.clientId);
      toast.success(`Sent "${report.title}" to ${client?.contactEmail ?? "the client"}.`);
    },
    [clientsById],
  );

  const handleDuplicate = useCallback((report: Report) => {
    toast.success(`Duplicated "${report.title}" as a new draft.`);
  }, []);

  const columns = useMemo(
    () =>
      buildReportColumns({
        clientsById,
        onDownload: handleDownload,
        onSendToClient: handleSendToClient,
        onDuplicate: handleDuplicate,
      }),
    [clientsById, handleDownload, handleSendToClient, handleDuplicate],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder="Search reports..."
      pageSize={8}
      emptyTitle="No reports yet"
      emptyDescription="Generate a report below to see it listed here."
      toolbar={
        <Select value={activeClientId} onValueChange={handleClientChange}>
          <SelectTrigger size="sm" className="w-full sm:w-56">
            <SelectValue placeholder="All clients">
              {(value: string | null) =>
                !value || value === ALL_CLIENTS ? "All clients" : (clientsById.get(value)?.name ?? "All clients")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CLIENTS}>All clients</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
