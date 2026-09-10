import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicalCheck } from "@/types";
import { TechnicalCheckStatusBadge } from "./technical-check-status-badge";

const CATEGORY_LABELS: Record<TechnicalCheck["category"], string> = {
  indexability: "Indexability",
  crawlability: "Crawlability",
  sitemap_robots: "Sitemap & Robots.txt",
  redirects: "Redirects",
  duplicate_content: "Duplicate Content",
  mobile: "Mobile",
  javascript: "JavaScript Rendering",
};

const CATEGORY_ORDER: TechnicalCheck["category"][] = [
  "indexability",
  "crawlability",
  "sitemap_robots",
  "redirects",
  "duplicate_content",
  "mobile",
  "javascript",
];

/** Technical checks grouped into a per-category checklist, each row showing a pass/warning/fail status. */
export function TechnicalChecksBoard({ checks }: { checks: TechnicalCheck[] }) {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: checks.filter((c) => c.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {groups.map((group) => {
        const failing = group.items.filter((c) => c.status === "fail").length;
        const warning = group.items.filter((c) => c.status === "warning").length;
        return (
          <Card key={group.category}>
            <CardHeader>
              <CardTitle>{group.label}</CardTitle>
              <CardDescription>
                {failing > 0
                  ? `${failing} check${failing === 1 ? "" : "s"} need${failing === 1 ? "s" : ""} attention`
                  : warning > 0
                    ? `${warning} check${warning === 1 ? "" : "s"} to review`
                    : "All checks passing"}
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {group.items.map((check) => (
                <div key={check.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <TechnicalCheckStatusBadge status={check.status} />
                    {check.affectedUrls > 0 && (
                      <span className="text-xs text-muted-foreground">{check.affectedUrls} URLs affected</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
