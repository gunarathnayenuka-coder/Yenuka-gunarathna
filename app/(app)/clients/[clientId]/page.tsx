import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  Globe,
  KeyRound,
  Mail,
  Phone,
  ShieldAlert,
  Swords,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { GenericStatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { fetchClient, fetchClientActivity } from "@/lib/services/clients";
import { listWebsitesByClient } from "@/lib/services/websites";
import { formatCompactNumber, formatDate, formatRelativeTime, initials } from "@/lib/format";
import { users } from "@/lib/mock-data";

const ACTIVITY_ICON: Record<string, string> = {
  audit_completed: "🔍",
  content_published: "✍️",
  report_sent: "📄",
  issue_resolved: "✅",
  keyword_ranked: "📈",
  note: "🗒️",
};

export default async function ClientOverviewPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = await fetchClient(clientId);
  if (!client) notFound();

  const [websites, activity] = await Promise.all([listWebsitesByClient(clientId), fetchClientActivity(clientId)]);
  const manager = users.find((u) => u.id === client.accountManagerId);

  return (
    <>
      <PageHeader
        title={client.name}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Clients", href: "/clients" }, { label: client.name }]}
        description={`${client.industry} · ${client.country}`}
        actions={
          <>
            <Button variant="outline" render={<Link href={`/portal?client=${client.id}`} target="_blank" />}>
              <ExternalLink /> View client portal
            </Button>
            <Button variant="outline" render={<Link href={`/reports?client=${client.id}`} />}>
              <FileText /> Generate report
            </Button>
            <Button render={<Link href={`/seo-audit?site=${client.primaryWebsiteId}`} />}>
              <ShieldAlert /> View SEO audit
            </Button>
          </>
        }
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="SEO health" value={`${client.seoHealthScore}/100`} icon={ShieldAlert} />
          <StatCard
            label="Organic traffic"
            value={formatCompactNumber(client.organicTraffic)}
            changePct={client.organicTrafficChangePct}
            icon={TrendingUp}
          />
          <StatCard label="Keywords tracked" value={formatCompactNumber(client.trackedKeywords)} icon={KeyRound} hint={`${client.top10Keywords} in top 10`} />
          <StatCard label="Open issues" value={client.openIssues} icon={ShieldAlert} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Websites</CardTitle>
                <CardDescription>{websites.length} website{websites.length !== 1 ? "s" : ""} tracked for this client</CardDescription>
                <CardAction>
                  <Button variant="outline" size="sm" render={<Link href="/websites/new" />}>
                    Add website
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                {websites.map((website) => (
                  <Link
                    key={website.id}
                    href={`/websites/${website.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Globe className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{website.domain}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCompactNumber(website.trackedKeywords)} keywords · Last crawled {formatRelativeTime(website.lastCrawlAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-sm font-semibold tabular-nums">{website.seoHealthScore}</span>
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Keywords", href: "/keywords", icon: KeyRound },
                { label: "Content", href: "/content", icon: FileText },
                { label: "Competitors", href: "/competitors", icon: Swords },
                { label: "Reports", href: "/reports", icon: FileText },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={`${item.href}?site=${client.primaryWebsiteId}`}
                  className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent/50"
                >
                  <item.icon className="size-5 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <GenericStatusBadge status={client.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account manager</span>
                  <span className="font-medium">{manager?.name ?? "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monthly budget</span>
                  <span className="font-medium">Rs {formatCompactNumber(client.monthlyBudget ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Client since</span>
                  <span className="font-medium">{formatDate(client.createdAt)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials(client.contactName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{client.contactName}</p>
                      <p className="truncate text-xs text-muted-foreground">Primary contact</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <Mail className="size-3.5" /> {client.contactEmail}
                    </p>
                    {client.contactPhone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3.5" /> {client.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.slice(0, 6).map((event) => (
                  <div key={event.id} className="flex gap-2.5 text-sm">
                    <span className="shrink-0">{ACTIVITY_ICON[event.type] ?? "•"}</span>
                    <div className="min-w-0">
                      <p className="text-foreground">{event.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.actor} · {formatRelativeTime(event.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
