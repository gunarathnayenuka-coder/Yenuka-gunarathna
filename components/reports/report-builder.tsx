"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "cn";
import { CalendarClock, Download, Eye, Send, Sparkles } from "lucide-react";
import type { Client, ReportType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenericStatusBadge } from "@/components/shared";
import { getWebsitesByClient } from "@/lib/mock-data";
import { getSchedulesByClient } from "@/lib/mock-data/reports";
import { formatDate } from "@/lib/format";
import {
  BRAND_COLORS,
  DATE_RANGE_PRESETS,
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  SECTION_OPTIONS,
  type DateRangePreset,
  type SectionKey,
} from "./labels";
import { ReportPreview } from "./report-preview";

const DEFAULT_SECTIONS: Record<SectionKey, boolean> = {
  traffic: true,
  rankings: true,
  technical: true,
  content: false,
  competitor: false,
};

export function ReportBuilder({ clients, initialClientId }: { clients: Client[]; initialClientId?: string }) {
  const [clientId, setClientId] = useState(initialClientId ?? "");
  const [websiteId, setWebsiteId] = useState("");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("Last 30 days");
  const [reportType, setReportType] = useState<ReportType>("monthly_seo");
  const [sections, setSections] = useState<Record<SectionKey, boolean>>(DEFAULT_SECTIONS);
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0]);
  const [logoUrl, setLogoUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const client = clients.find((c) => c.id === clientId);
  const clientWebsites = useMemo(() => (clientId ? getWebsitesByClient(clientId) : []), [clientId]);
  const website = clientWebsites.find((w) => w.id === websiteId);
  const schedules = useMemo(() => (clientId ? getSchedulesByClient(clientId) : []), [clientId]);
  const canAct = Boolean(client && website);

  function handleClientChange(value: string | null) {
    setClientId(value ?? "");
    setWebsiteId("");
    setShowPreview(false);
  }

  function handleWebsiteChange(value: string | null) {
    setWebsiteId(value ?? "");
    setShowPreview(false);
  }

  function toggleSection(key: SectionKey, checked: boolean) {
    setSections((prev) => ({ ...prev, [key]: checked }));
  }

  function handlePreview() {
    if (!canAct) {
      toast.error("Select a client and website first.");
      return;
    }
    setShowPreview(true);
  }

  function handleGenerate() {
    if (!canAct || !client) return;
    toast.success(`${REPORT_TYPE_LABELS[reportType]} report generated for ${client.name} — ready to download or send.`);
    setShowPreview(true);
  }

  function handleDownload() {
    if (!canAct || !client) return;
    toast.success(`${REPORT_TYPE_LABELS[reportType]} report for ${client.name} — PDF download started.`);
  }

  function handleSend() {
    if (!canAct || !client) return;
    toast.success(`Sent to ${client.contactEmail}.`);
  }

  function handleSchedule() {
    if (!canAct || !client) return;
    toast.success(`${REPORT_TYPE_LABELS[reportType]} reports scheduled for ${client.name}.`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report builder</CardTitle>
        <CardDescription>Configure and preview a client report before generating or sending it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="report-client">Client</Label>
            <Select value={clientId} onValueChange={handleClientChange}>
              <SelectTrigger id="report-client" className="w-full">
                <SelectValue placeholder="Select a client">
                  {(value: string | null) => clients.find((c) => c.id === value)?.name ?? "Select a client"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-website">Website</Label>
            <Select value={websiteId} onValueChange={handleWebsiteChange} disabled={!clientId}>
              <SelectTrigger id="report-website" className="w-full">
                <SelectValue placeholder={clientId ? "Select a website" : "Select a client first"}>
                  {(value: string | null) =>
                    clientWebsites.find((w) => w.id === value)?.domain ?? (clientId ? "Select a website" : "Select a client first")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clientWebsites.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-date-range">Date range</Label>
            <Select value={datePreset} onValueChange={(v) => setDatePreset((v as DateRangePreset | null) ?? "Last 30 days")}>
              <SelectTrigger id="report-date-range" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {preset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {datePreset === "Custom" && (
              <p className="text-xs text-muted-foreground">Custom ranges are coming soon — using the last 30 days for now.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-type">Report type</Label>
            <Select value={reportType} onValueChange={(v) => setReportType((v as ReportType | null) ?? "monthly_seo")}>
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue>{(v: string | null) => REPORT_TYPE_LABELS[v as ReportType] ?? v}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {REPORT_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {schedules.length > 0 && client && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">Existing schedules for {client.name}</p>
            <ul className="mt-2 space-y-1.5">
              {schedules.map((schedule) => (
                <li key={schedule.id} className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    {schedule.frequency === "weekly" ? "Weekly" : "Monthly"} {REPORT_TYPE_LABELS[schedule.type]} · {schedule.recipients.length}{" "}
                    recipient{schedule.recipients.length === 1 ? "" : "s"} · next {formatDate(schedule.nextSendAt)}
                  </span>
                  <GenericStatusBadge status={schedule.isEnabled ? "active" : "paused"} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Label>Sections to include</Label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SECTION_OPTIONS.map((opt) => (
              <Label
                key={opt.key}
                className="flex items-center gap-2 rounded-lg border p-2.5 text-sm font-normal has-data-checked:border-primary has-data-checked:bg-accent"
              >
                <Checkbox checked={sections[opt.key]} onCheckedChange={(checked) => toggleSection(opt.key, checked)} />
                {opt.label}
              </Label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Branding</Label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color} as the report accent color`}
                  aria-pressed={brandColor === color}
                  onClick={() => setBrandColor(color)}
                  className={cn(
                    "size-6 rounded-full ring-offset-2 ring-offset-background transition-transform",
                    brandColor === color ? "ring-2 ring-foreground" : "hover:scale-110",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="min-w-48 flex-1">
              <Input placeholder="Logo URL (optional)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye /> Preview
          </Button>
          <Button type="button" onClick={handleGenerate} disabled={!canAct}>
            <Sparkles /> Generate
          </Button>
          <Button type="button" variant="outline" onClick={handleDownload} disabled={!canAct}>
            <Download /> Download PDF
          </Button>
          <Button type="button" variant="outline" onClick={handleSend} disabled={!canAct}>
            <Send /> Send to client
          </Button>
          <Button type="button" variant="outline" onClick={handleSchedule} disabled={!canAct}>
            <CalendarClock /> Schedule
          </Button>
        </div>

        {showPreview && client && website && (
          <ReportPreview
            client={client}
            website={website}
            reportType={reportType}
            datePreset={datePreset}
            sections={sections}
            brandColor={brandColor}
            logoUrl={logoUrl}
          />
        )}
      </CardContent>
    </Card>
  );
}
