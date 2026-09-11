import type { ColumnDef } from "@tanstack/react-table";
import { History, MoreHorizontal, Pencil, Play, Power } from "lucide-react";
import type { AutomationRule, Website } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { FREQUENCY_LABELS, TRIGGER_LABELS } from "./labels";

export interface AutomationColumnsContext {
  websitesById: Map<string, Website>;
  enabledMap: Record<string, boolean>;
  onToggleEnabled: (rule: AutomationRule, next: boolean) => void;
  onRunNow: (rule: AutomationRule) => void;
  onEdit: (rule: AutomationRule) => void;
  onViewHistory: (rule: AutomationRule) => void;
}

/** Column defs for the automation rules DataTable. `ctx` carries callbacks wired up in the client wrapper. */
export function buildAutomationColumns(ctx: AutomationColumnsContext): ColumnDef<AutomationRule>[] {
  return [
    {
      accessorKey: "name",
      header: "Automation",
      cell: ({ row }) => {
        const rule = row.original;
        const website = rule.websiteId ? ctx.websitesById.get(rule.websiteId) : undefined;
        return (
          <div className="min-w-0">
            <p className="max-w-64 truncate font-medium">{rule.name}</p>
            <p className="truncate text-xs text-muted-foreground">{website ? website.domain : "All websites"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "trigger",
      header: "Trigger",
      cell: ({ row }) => <span className="text-muted-foreground">{TRIGGER_LABELS[row.original.trigger]}</span>,
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row }) => {
        const frequency = row.original.frequency;
        return <span className="text-muted-foreground">{frequency ? FREQUENCY_LABELS[frequency] : "Event-based"}</span>;
      },
    },
    {
      accessorKey: "lastRunAt",
      header: "Last run",
      cell: ({ row }) => {
        const rule = row.original;
        if (!rule.lastRunAt) return <span className="text-muted-foreground">Never run</span>;
        return (
          <div className="space-y-1">
            <p className="text-muted-foreground">{formatRelativeTime(rule.lastRunAt)}</p>
            {rule.lastRunStatus && <GenericStatusBadge status={rule.lastRunStatus} />}
          </div>
        );
      },
    },
    {
      accessorKey: "nextRunAt",
      header: "Next run",
      cell: ({ row }) => {
        const value = row.original.nextRunAt;
        return <span className="text-muted-foreground">{value ? formatDate(value) : "—"}</span>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const rule = row.original;
        const enabled = ctx.enabledMap[rule.id] ?? rule.isEnabled;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={enabled}
              onCheckedChange={(next) => ctx.onToggleEnabled(rule, next)}
              aria-label={enabled ? `Disable ${rule.name}` : `Enable ${rule.name}`}
            />
            <span className="text-xs text-muted-foreground">{enabled ? "Enabled" : "Disabled"}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rule = row.original;
        const enabled = ctx.enabledMap[rule.id] ?? rule.isEnabled;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${rule.name}`} />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => ctx.onRunNow(rule)}>
                <Play /> Run now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => ctx.onViewHistory(rule)}>
                <History /> View run history
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => ctx.onEdit(rule)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => ctx.onToggleEnabled(rule, !enabled)}>
                <Power /> {enabled ? "Disable" : "Enable"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
