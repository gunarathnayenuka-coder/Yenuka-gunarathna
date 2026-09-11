"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DATE_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "28d", label: "Last 28 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
] as const;

const DEFAULT_RANGE = "28d";

/**
 * Date-range preset dropdown for the Analytics pages. There is no date-picker component in
 * this project, so a preset Select is the intentional choice here; it's cosmetic against the
 * fixed 12-week mock series (selecting a range doesn't refetch data).
 */
export function DateRangeSelect() {
  const [range, setRange] = useState<string>(DEFAULT_RANGE);

  return (
    <Select value={range} onValueChange={(value) => setRange(value ?? DEFAULT_RANGE)}>
      <SelectTrigger size="sm" className="w-full sm:w-40">
        <SelectValue placeholder="Last 28 days">
          {(value: string | null) => DATE_RANGE_OPTIONS.find((o) => o.value === value)?.label ?? "Last 28 days"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
