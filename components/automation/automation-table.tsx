"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AutomationRule, AutomationRun, Website } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { buildAutomationColumns } from "./columns";
import { RunHistorySheet } from "./run-history-sheet";

export function AutomationTable({
  data,
  runsByRule,
  websites,
}: {
  data: AutomationRule[];
  runsByRule: Record<string, AutomationRun[]>;
  websites: Website[];
}) {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(data.map((rule) => [rule.id, rule.isEnabled])),
  );
  const [historyRule, setHistoryRule] = useState<AutomationRule | null>(null);

  const handleToggleEnabled = useCallback((rule: AutomationRule, next: boolean) => {
    setEnabledMap((prev) => ({ ...prev, [rule.id]: next }));
    toast.success(`${rule.name} ${next ? "enabled" : "disabled"}.`);
  }, []);

  const handleRunNow = useCallback((rule: AutomationRule) => {
    toast.success(`${rule.name} started — check run history shortly for results.`);
  }, []);

  const handleEdit = useCallback(() => {
    toast.info("Editing coming soon.");
  }, []);

  const handleViewHistory = useCallback((rule: AutomationRule) => {
    setHistoryRule(rule);
  }, []);

  const websitesById = useMemo(() => new Map(websites.map((w) => [w.id, w])), [websites]);

  const columns = useMemo(
    () =>
      buildAutomationColumns({
        websitesById,
        enabledMap,
        onToggleEnabled: handleToggleEnabled,
        onRunNow: handleRunNow,
        onEdit: handleEdit,
        onViewHistory: handleViewHistory,
      }),
    [websitesById, enabledMap, handleToggleEnabled, handleRunNow, handleEdit, handleViewHistory],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search automations..."
        pageSize={9}
        emptyTitle="No automations yet"
        emptyDescription="Automation rules will appear here once configured."
      />
      <RunHistorySheet
        rule={historyRule}
        runs={historyRule ? (runsByRule[historyRule.id] ?? []) : []}
        onOpenChange={(open) => !open && setHistoryRule(null)}
      />
    </>
  );
}
