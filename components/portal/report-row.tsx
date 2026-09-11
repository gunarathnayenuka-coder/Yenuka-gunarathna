"use client";

import { toast } from "sonner";
import { Download, FileText } from "lucide-react";
import type { Report } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

const STATUS_LABEL: Record<Report["status"], string> = {
  draft: "In progress",
  generated: "Ready",
  sent: "Delivered",
  scheduled: "Scheduled",
};

export function PortalReportRow({ report }: { report: Report }) {
  const canDownload = report.status === "generated" || report.status === "sent";

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{report.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(report.dateRange.from)} – {formatDate(report.dateRange.to)} · {STATUS_LABEL[report.status]}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!canDownload}
          onClick={() => toast.success(`Downloading ${report.title}.pdf`)}
        >
          <Download /> Download
        </Button>
      </CardContent>
    </Card>
  );
}
