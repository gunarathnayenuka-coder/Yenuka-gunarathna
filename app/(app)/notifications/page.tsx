import { Bell, BellRing, Sparkles, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/shared";
import { NotificationList } from "@/components/notifications/notification-list";
import { listNotifications } from "@/lib/services/notifications";

export default async function NotificationsPage() {
  const notifications = await listNotifications();
  const unread = notifications.filter((notification) => !notification.isRead).length;
  const critical = notifications.filter((notification) => notification.priority === "critical").length;
  const opportunities = notifications.filter((notification) => notification.priority === "opportunity").length;

  return (
    <>
      <PageHeader
        title="Notifications"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Notifications" }]}
        description="Every alert and update across your clients and websites, in one place."
      />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total notifications" value={notifications.length} icon={Bell} />
          <StatCard
            label="Unread"
            value={unread}
            icon={BellRing}
            hint={unread > 0 ? "Needs your attention" : "All caught up"}
          />
          <StatCard label="Critical" value={critical} icon={TriangleAlert} />
          <StatCard label="Opportunities" value={opportunities} icon={Sparkles} />
        </div>
        <NotificationList notifications={notifications} />
      </div>
    </>
  );
}
