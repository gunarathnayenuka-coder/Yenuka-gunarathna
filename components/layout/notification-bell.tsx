"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PriorityDot } from "@/components/shared/priority-badge";
import type { Notification } from "@/types";

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: Notification[];
  unreadCount: number;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" render={<Link href="/notifications" />}>
            View all
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.href ?? "/notifications"}
                className="flex gap-2.5 border-b px-4 py-3 text-sm last:border-b-0 hover:bg-accent"
              >
                <PriorityDot priority={n.priority} className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <p className={n.isRead ? "text-foreground/80" : "font-medium"}>{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">{formatRelativeTime(n.createdAt)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
