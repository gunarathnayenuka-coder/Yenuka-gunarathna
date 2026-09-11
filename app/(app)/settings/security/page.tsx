import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SecurityPanel } from "@/components/settings/security-panel";

export default function SecuritySettingsPage() {
  return (
    <>
      <PageHeader
        title="Security"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Security" }]}
        description="Manage sign-in security, active sessions and API access."
      />
      <SettingsNav />
      <div className="flex-1 p-4 md:p-6">
        <SecurityPanel />
      </div>
    </>
  );
}
