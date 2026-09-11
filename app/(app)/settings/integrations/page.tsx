import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { IntegrationsPanel } from "@/components/settings/integrations-panel";

export default function IntegrationsSettingsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Integrations" }]}
        description="Connect the tools your agency already uses for data, alerts and reporting."
      />
      <SettingsNav />
      <div className="flex-1 p-4 md:p-6">
        <IntegrationsPanel />
      </div>
    </>
  );
}
