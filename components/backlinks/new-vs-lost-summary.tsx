/** Small proportional-bar pairing of new vs. lost backlink counts (status colors, always labeled —
 * never color-alone). Kept as plain CSS bars rather than a chart library for a widget this small. */
export function NewVsLostSummary({ newCount, lostCount }: { newCount: number; lostCount: number }) {
  const max = Math.max(newCount, lostCount, 1);
  const rows: { label: string; count: number; color: string }[] = [
    { label: "New backlinks", count: newCount, color: "var(--success)" },
    { label: "Lost backlinks", count: lostCount, color: "var(--critical)" },
  ];

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-foreground">{row.label}</span>
            <span className="font-semibold tabular-nums" style={{ color: row.color }}>
              {row.count}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(3, (row.count / max) * 100)}%`, backgroundColor: row.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
