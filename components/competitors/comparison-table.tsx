import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Competitor } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompactNumber } from "@/lib/format";

/** Green/amber/red tone for a 0-100 score. */
function scoreTone(value: number): string {
  if (value >= 75) return "text-success";
  if (value >= 50) return "text-warning";
  return "text-critical";
}

export interface ComparisonMetric {
  label: string;
  you: number;
  /** Aligned by index with the `competitors` array passed to `ComparisonTable`. */
  competitorValues: number[];
  format?: (value: number) => string;
  /** Color the value by the same red/amber/green bands used for SEO scores elsewhere. */
  colorByScore?: boolean;
}

/**
 * "You vs C1 vs C2 vs C3" comparison grid. This is a transposed metric-by-competitor matrix, not a
 * row-per-entity list, so it's a small hand-built table rather than the TanStack DataTable pattern
 * used for the module's other (row-per-record) tables.
 */
export function ComparisonTable({
  websiteDomain,
  competitors,
  metrics,
}: {
  websiteDomain: string;
  competitors: Competitor[];
  metrics: ComparisonMetric[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="bg-primary/5">
                <div className="flex flex-col py-0.5">
                  <span className="font-semibold text-foreground">You</span>
                  <span className="text-xs font-normal text-muted-foreground">{websiteDomain}</span>
                </div>
              </TableHead>
              {competitors.map((competitor) => (
                <TableHead key={competitor.id}>
                  <Link
                    href={`https://${competitor.domain}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-medium hover:underline"
                  >
                    <span className="max-w-32 truncate">{competitor.domain}</span>
                    <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.label}>
                <TableCell className="font-medium text-muted-foreground">{metric.label}</TableCell>
                <TableCell
                  className={`bg-primary/5 font-semibold tabular-nums ${metric.colorByScore ? scoreTone(metric.you) : "text-foreground"}`}
                >
                  {metric.format ? metric.format(metric.you) : formatCompactNumber(metric.you)}
                </TableCell>
                {metric.competitorValues.map((value, i) => (
                  <TableCell
                    key={competitors[i]?.id ?? i}
                    className={`tabular-nums ${metric.colorByScore ? scoreTone(value) : ""}`}
                  >
                    {metric.format ? metric.format(value) : formatCompactNumber(value)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
