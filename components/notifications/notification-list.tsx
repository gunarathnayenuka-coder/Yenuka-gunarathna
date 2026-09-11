"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";
import type { Notification, NotificationType } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PriorityDot } from "@/components/shared";
import { formatRelativeTime } from "@/lib/format";

const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  ranking_drop: "Ranking drop",
  ranking_gain: "Ranking gain",
  traffic_increase: "Traffic increase",
  traffic_drop: "Traffic drop",
  critical_issue: "Critical issue",
  audit_completed: "Audit completed",
  report_generated: "Report generated",
  competitor_change: "Competitor change",
  keyword_opportunity: "Keyword opportunity",
  new_backlink: "New backlink",
  lost_backlink: "Lost backlink",
};

const ALL_TYPES = "all";
type StatusFilter = "all" | "unread" | "read";

/**
 * Full, filterable notification center — a taller version of the same PriorityDot + title +
 * message + relative-time row already used by the header bell's preview popover. Read state is
 * purely client-local, seeded from the server-fetched array; nothing is persisted.
 */
export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set<string>());
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  function isRead(notification: Notification): boolean {
    return notification.isRead || readIds.has(notification.id);
  }

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !(notification.isRead || readIds.has(notification.id))).length,
    [notifications, readIds],
  );

  const availableTypes = useMemo(
    () => Array.from(new Set(notifications.map((notification) => notification.type))),
    [notifications],
  );

  const filtered = useMemo(() => {
    return notifications.filter((notification) => {
      if (typeFilter !== ALL_TYPES && notification.type !== typeFilter) return false;
      const read = notification.isRead || readIds.has(notification.id);
      if (statusFilter === "unread" && read) return false;
      if (statusFilter === "read" && !read) return false;
      return true;
    });
  }, [notifications, typeFilter, statusFilter, readIds]);

  function markRead(id: string) {
    setReadIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((notification) => notification.id)));
    toast.success("All notifications marked as read.");
  }

  function clearFilters() {
    setTypeFilter(ALL_TYPES);
    setStatusFilter("all");
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="You're all caught up"
        description="New alerts about rankings, traffic and site health will show up here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value ?? ALL_TYPES)}>
            <SelectTrigger size="sm" className="w-full sm:w-52">
              <SelectValue placeholder="All types">
                {(value: string | null) =>
                  !value || value === ALL_TYPES ? "All types" : NOTIFICATION_TYPE_LABELS[value as NotificationType]
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TYPES}>All types</SelectItem>
              {availableTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {NOTIFICATION_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger size="sm" className="w-full sm:w-36">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck /> Mark all as read
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No notifications match your filters"
          description="Try a different type or status filter."
          action={
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="divide-y">
            {filtered.map((notification) => {
              const read = isRead(notification);
              return (
                <Link
                  key={notification.id}
                  href={notification.href ?? "/notifications"}
                  onClick={() => markRead(notification.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-accent/50",
                    !read && "bg-primary/[0.03]",
                  )}
                >
                  <PriorityDot priority={notification.priority} className="mt-1.5" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className={read ? "text-foreground/70" : "font-medium"}>{notification.title}</p>
                    <p className={cn("text-muted-foreground", !read && "text-foreground/80")}>{notification.message}</p>
                    <p className="text-xs text-muted-foreground/70">
                      {NOTIFICATION_TYPE_LABELS[notification.type]} · {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
