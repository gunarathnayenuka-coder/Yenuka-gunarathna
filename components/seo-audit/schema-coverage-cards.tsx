import { Braces } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SchemaCoverage } from "@/types";

export function SchemaCoverageCards({ coverage }: { coverage: SchemaCoverage[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {coverage.map((item) => {
        const pct = item.pagesEligible > 0 ? Math.round((item.pagesImplemented / item.pagesEligible) * 100) : 0;
        return (
          <Card key={item.type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Braces className="size-4 text-muted-foreground" />
                {item.type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold tabular-nums">{pct}%</span>
                <span className="text-xs text-muted-foreground">
                  {item.pagesImplemented}/{item.pagesEligible} pages
                </span>
              </div>
              <Progress value={pct} />
              {item.pagesEligible === 0 ? (
                <p className="text-xs text-muted-foreground">No eligible pages on this site</p>
              ) : item.pagesWithErrors > 0 ? (
                <p className="text-xs text-critical">
                  {item.pagesWithErrors} page{item.pagesWithErrors === 1 ? "" : "s"} with markup errors
                </p>
              ) : (
                <p className="text-xs text-success">No markup errors</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
