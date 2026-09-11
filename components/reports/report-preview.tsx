import { KeyRound, Target, TrendingUp } from "lucide-react";
import type { Client, ReportType, Website } from "@/types";
import { ScoreBar, ScoreRing, StatCard } from "@/components/shared";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { getKeywordsByWebsite, getScoreBreakdown, getTrafficHistory } from "@/lib/mock-data";
import { formatCompactNumber, formatNumber } from "@/lib/format";
import { REPORT_TYPE_LABELS, type DateRangePreset, type SectionKey } from "./labels";

/** How many of the 12 weekly traffic points to show for each date-range preset. */
const PRESET_POINTS: Record<DateRangePreset, number> = {
  "Last 7 days": 2,
  "Last 30 days": 5,
  "Last quarter": 12,
  Custom: 12,
};

export function ReportPreview({
  client,
  website,
  reportType,
  datePreset,
  sections,
  brandColor,
  logoUrl,
}: {
  client: Client;
  website: Website;
  reportType: ReportType;
  datePreset: DateRangePreset;
  sections: Record<SectionKey, boolean>;
  brandColor: string;
  logoUrl: string;
}) {
  const scoreBreakdown = getScoreBreakdown(website.id);
  const trafficHistory = getTrafficHistory(website.id);
  const keywords = getKeywordsByWebsite(website.id);
  const top10Count = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  const slicedTraffic = trafficHistory.slice(-PRESET_POINTS[datePreset]);
  const anySelected = Object.values(sections).some(Boolean);

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Preview</p>
          <h3 className="truncate text-base font-semibold">
            {REPORT_TYPE_LABELS[reportType]} Report — {client.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {website.domain} · {datePreset}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="size-3 rounded-full ring-1 ring-foreground/10" style={{ backgroundColor: brandColor }} />
          <span className="text-xs text-muted-foreground">{logoUrl.trim() ? "Custom branding" : "Default branding"}</span>
        </div>
      </div>

      {!anySelected ? (
        <p className="text-sm text-muted-foreground">Select at least one section above to preview report content.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex flex-col items-center gap-1 sm:pr-2">
              <ScoreRing score={scoreBreakdown.overall} size={84} strokeWidth={7} label="/ 100" />
              <span className="text-xs text-muted-foreground">SEO Health</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sections.traffic && (
                <StatCard
                  label="Organic traffic"
                  value={formatCompactNumber(website.organicTraffic)}
                  changePct={website.organicTrafficChangePct}
                  icon={TrendingUp}
                />
              )}
              {sections.rankings && (
                <StatCard label="Keywords tracked" value={formatNumber(keywords.length)} icon={KeyRound} />
              )}
              {sections.rankings && <StatCard label="Top 10 rankings" value={formatNumber(top10Count)} icon={Target} />}
            </div>
          </div>

          {sections.traffic && (
            <div>
              <p className="mb-2 text-sm font-medium">Traffic trend</p>
              <TrafficChart data={slicedTraffic} />
            </div>
          )}

          {sections.technical && (
            <div className="space-y-2.5">
              <p className="text-sm font-medium">Technical audit</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <ScoreBar label="Technical SEO" score={scoreBreakdown.technical} />
                <ScoreBar label="On-Page SEO" score={scoreBreakdown.onPage} />
                <ScoreBar label="Performance" score={scoreBreakdown.performance} />
                <ScoreBar label="Content" score={scoreBreakdown.content} />
              </div>
            </div>
          )}

          {(sections.content || sections.competitor) && (
            <p className="text-xs text-muted-foreground">
              Also included:{" "}
              {[sections.content && "Content Performance", sections.competitor && "Competitor Summary"].filter(Boolean).join(" · ")}.
            </p>
          )}
        </>
      )}
    </div>
  );
}
