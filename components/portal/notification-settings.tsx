"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PREFERENCES = [
  {
    key: "monthlyReport",
    label: "Monthly performance report",
    description: "Get an email as soon as your monthly report is ready.",
  },
  {
    key: "rankingAlerts",
    label: "Ranking alerts",
    description: "Get notified when your rankings move significantly.",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    description: "Occasional news about new Aviance features.",
  },
] as const;

export function PortalNotificationSettings() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    monthlyReport: true,
    rankingAlerts: true,
    productUpdates: false,
  });

  function handleChange(key: string, label: string, checked: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: checked }));
    toast.success(`${label} ${checked ? "enabled" : "disabled"}.`);
  }

  return (
    <div className="space-y-3">
      {PREFERENCES.map((pref) => (
        <div key={pref.key} className="flex items-center justify-between gap-4 rounded-lg border p-3.5">
          <div className="min-w-0">
            <Label htmlFor={pref.key} className="text-sm font-medium">
              {pref.label}
            </Label>
            <p className="text-xs text-muted-foreground">{pref.description}</p>
          </div>
          <Switch
            id={pref.key}
            checked={prefs[pref.key]}
            onCheckedChange={(checked) => handleChange(pref.key, pref.label, checked)}
          />
        </div>
      ))}
    </div>
  );
}
