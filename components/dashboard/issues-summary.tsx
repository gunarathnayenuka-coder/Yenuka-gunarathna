import Link from "next/link";
import type { SEOIssue, Severity } from "@/types";
import { SEVERITY_ORDER } from "@/types";

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: "bg-critical",
  high: "bg-warning",
  medium: "bg-info",
  low: "bg-muted-foreground",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function IssuesSummary({ issues }: { issues: SEOIssue[] }) {
  const open = issues.filter((i) => i.status === "open" || i.status === "in_progress");
  const counts = SEVERITY_ORDER.map((severity) => ({
    severity,
    count: open.filter((i) => i.severity === severity).length,
  }));
  const total = open.length || 1;

  return (
    <div className="space-y-4">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {counts.map(
          ({ severity, count }) =>
            count > 0 && (
              <div
                key={severity}
                className={SEVERITY_STYLES[severity]}
                style={{ width: `${(count / total) * 100}%` }}
              />
            ),
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(({ severity, count }) => (
          <Link
            key={severity}
            href={`/seo-audit/issues?severity=${severity}`}
            className="rounded-lg border p-3 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${SEVERITY_STYLES[severity]}`} />
              <span className="text-xs text-muted-foreground">{SEVERITY_LABELS[severity]}</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums">{count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
