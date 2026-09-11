import type { ColumnDef } from "@tanstack/react-table";
import type { Competitor, CompetitorKeywordGap } from "@/types";
import { formatCompactNumber, formatRank } from "@/lib/format";

/** Green/amber/red tone for a 0-100 score. `invert` when a lower value is the good outcome (e.g. difficulty). */
function scoreTone(value: number, invert = false): string {
  const good = invert ? value <= 30 : value >= 75;
  const warn = invert ? value <= 60 : value >= 50;
  if (good) return "text-success";
  if (warn) return "text-warning";
  return "text-critical";
}

/** Column defs need a competitor id -> domain lookup, so this is a factory like `buildWebsiteColumns`. */
export function buildKeywordGapColumns(competitorsById: Map<string, Competitor>): ColumnDef<CompetitorKeywordGap>[] {
  return [
    {
      accessorKey: "keyword",
      header: "Keyword",
      cell: ({ row }) => <span className="block max-w-56 truncate font-medium">{row.original.keyword}</span>,
    },
    {
      accessorKey: "ourRank",
      header: "Our Rank",
      cell: ({ row }) => <span className="font-medium tabular-nums">{formatRank(row.original.ourRank)}</span>,
    },
    {
      id: "competitorRank",
      header: "Best Competitor Rank",
      cell: ({ row }) => {
        const ranks = row.original.competitorRanks;
        if (ranks.length === 0) return <span className="text-muted-foreground">—</span>;
        const best = [...ranks].sort((a, b) => a.rank - b.rank)[0];
        const domain = competitorsById.get(best.competitorId)?.domain ?? "Unknown competitor";
        const extra = ranks.length - 1;
        return (
          <div className="min-w-0">
            <span className="font-medium tabular-nums text-success">{formatRank(best.rank)}</span>{" "}
            <span className="text-xs text-muted-foreground">{domain}</span>
            {extra > 0 && (
              <span
                className="ml-1 text-xs text-muted-foreground"
                title={ranks
                  .map((r) => `${competitorsById.get(r.competitorId)?.domain ?? "Unknown competitor"}: ${formatRank(r.rank)}`)
                  .join("\n")}
              >
                +{extra} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: ({ row }) => <span className="tabular-nums">{formatCompactNumber(row.original.volume)}</span>,
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => (
        <span className={`font-medium tabular-nums ${scoreTone(row.original.difficulty, true)}`}>{row.original.difficulty}</span>
      ),
    },
    {
      accessorKey: "opportunityScore",
      header: "Opportunity",
      cell: ({ row }) => (
        <span className={`font-semibold tabular-nums ${scoreTone(row.original.opportunityScore)}`}>
          {row.original.opportunityScore}
        </span>
      ),
    },
  ];
}
