import { Building2, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { OrganizationForm } from "@/components/settings/organization-form";
import { DemoActionButton } from "@/components/settings/demo-action-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { organization } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import type { PlanTier } from "@/types";

const PLAN_TIER_LABELS: Record<PlanTier, string> = {
  starter: "Starter",
  growth: "Growth",
  agency: "Agency",
  enterprise: "Enterprise",
};

export default function OrganizationSettingsPage() {
  const seatsPct = Math.round((organization.seatsUsed / organization.seatsLimit) * 100);

  return (
    <>
      <PageHeader
        title="Organization"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Organization" }]}
        description="Manage your agency's workspace, plan and branding."
      />
      <SettingsNav />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{organization.name}</CardTitle>
            <CardDescription>Organization overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed bg-muted text-muted-foreground">
                <Building2 className="size-6" />
              </div>
              <div className="space-y-1.5">
                <DemoActionButton
                  variant="outline"
                  size="sm"
                  toastMessage="This is a demo — logo uploads will be wired up with the backend integration."
                >
                  <Upload /> Upload logo
                </DemoActionButton>
                <p className="text-xs text-muted-foreground">PNG or SVG, up to 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Plan</p>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{PLAN_TIER_LABELS[organization.plan]}</Badge>
                  <DemoActionButton
                    size="sm"
                    toastMessage="This is a demo — plan upgrades will be wired up with billing."
                  >
                    Upgrade plan
                  </DemoActionButton>
                </div>
              </div>
              <div className="space-y-1.5 rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="pt-1.5 text-sm font-medium">{formatDate(organization.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Seats used</span>
                <span className="font-medium tabular-nums">
                  {organization.seatsUsed} of {organization.seatsLimit}
                </span>
              </div>
              <Progress value={seatsPct} />
            </div>
          </CardContent>
        </Card>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Organization details</CardTitle>
            <CardDescription>Update your agency&apos;s display name.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
