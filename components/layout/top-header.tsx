import { Suspense } from "react";
import { currentUser } from "@/lib/mock-data";
import { fetchRecentNotifications, fetchUnreadCount } from "@/lib/services";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell } from "./notification-bell";
import { UserMenu } from "./user-menu";
import { WebsiteSwitcher } from "./website-switcher";

async function HeaderNotifications() {
  const [notifications, unreadCount] = await Promise.all([fetchRecentNotifications(6), fetchUnreadCount()]);
  return <NotificationBell notifications={notifications} unreadCount={unreadCount} />;
}

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <Suspense fallback={<div className="h-7 w-[240px] rounded-lg bg-muted" />}>
        <WebsiteSwitcher />
      </Suspense>
      <div className="ml-auto flex items-center gap-1">
        <Suspense fallback={<div className="size-8" />}>
          <HeaderNotifications />
        </Suspense>
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <UserMenu user={currentUser} />
      </div>
    </header>
  );
}
