import { Gauge, Layers, Monitor, MousePointerClick, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { CwvMetricCard } from "@/components/seo-audit/cwv-metric-card";
import { CwvTable } from "@/components/seo-audit/cwv-table";
import { fetchCoreWebVitalsSummary } from "@/lib/services/performance";
import { fetchWebsite, fetchWebsitePages } from "@/lib/services/websites";
import { resolveWebsiteIdFromSearchParams, type SearchParams } from "@/lib/website-context";

export default async function PerformanceSeoPage({ searchParams }: { searchParams: SearchParams }) {
  const websiteId = await resolveWebsiteIdFromSearchParams(searchParams);

  const [website, summary, pages] = await Promise.all([
    fetchWebsite(websiteId),
    fetchCoreWebVitalsSummary(websiteId),
    fetchWebsitePages(websiteId),
  ]);

  const worstPages = [...pages].sort((a, b) => b.lcpMs - a.lcpMs);

  return (
    <>
      <PageHeader
        title="Performance"
        description={`Core Web Vitals and page-speed signals for ${website?.domain ?? "this website"}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "SEO Audit", href: "/seo-audit" },
          { label: "Performance" },
        ]}
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CwvMetricCard
            label="Largest Contentful Paint"
            value={`${(summary.lcpMs / 1000).toFixed(2)}s`}
            threshold="Good < 2.5s · Poor > 4.0s"
            rating={summary.lcpRating}
            icon={Gauge}
          />
          <CwvMetricCard
            label="Interaction to Next Paint"
            value={`${summary.inpMs}ms`}
            threshold="Good < 200ms · Poor > 500ms"
            rating={summary.inpRating}
            icon={MousePointerClick}
          />
          <CwvMetricCard
            label="Cumulative Layout Shift"
            value={summary.cls.toFixed(2)}
            threshold="Good < 0.1 · Poor > 0.25"
            rating={summary.clsRating}
            icon={Layers}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard label="Mobile performance score" value={`${summary.mobileScore}/100`} icon={Smartphone} />
          <StatCard label="Desktop performance score" value={`${summary.desktopScore}/100`} icon={Monitor} />
          <StatCard
            label="URLs with good Core Web Vitals"
            value={`${summary.pctUrlsGood}%`}
            icon={Gauge}
            className="col-span-2 lg:col-span-1"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">Worst-performing pages</h2>
          <CwvTable data={worstPages} />
        </div>
      </div>
    </>
  );
}
