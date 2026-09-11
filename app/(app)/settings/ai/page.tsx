import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { AiSettingsPanel } from "@/components/settings/ai-settings-panel";

export default function AiSettingsPage() {
  return (
    <>
      <PageHeader
        title="AI Settings"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "AI Settings" }]}
        description="Decide where AI can act automatically, and where a human always has the final say."
      />
      <SettingsNav />
      <div className="flex-1 p-4 md:p-6">
        <AiSettingsPanel />
      </div>
    </>
  );
}
