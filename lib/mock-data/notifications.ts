import type { Notification, NotificationType, RecommendationPriority } from "@/types";
import { chance, daysAgo, makeId, pick, randInt, rngFor } from "./rng";
import { websites } from "./websites";
import { clients } from "./clients";

interface NotificationTemplate {
  type: NotificationType;
  priority: RecommendationPriority;
  title: string;
  message: (domain: string) => string;
}

const TEMPLATES: NotificationTemplate[] = [
  {
    type: "ranking_drop",
    priority: "high",
    title: "Ranking dropped",
    message: (d) => `A tracked keyword on ${d} dropped more than 5 positions.`,
  },
  {
    type: "ranking_gain",
    priority: "opportunity",
    title: "Keyword entered the top 10",
    message: (d) => `A keyword on ${d} just entered the top 10 results.`,
  },
  {
    type: "traffic_increase",
    priority: "low",
    title: "Traffic increased",
    message: (d) => `Organic traffic on ${d} is trending up this week.`,
  },
  {
    type: "traffic_drop",
    priority: "critical",
    title: "Traffic drop detected",
    message: (d) => `Organic sessions on ${d} fell sharply compared to last week.`,
  },
  {
    type: "critical_issue",
    priority: "critical",
    title: "Critical SEO issue found",
    message: (d) => `A new critical technical issue was detected on ${d} during the latest crawl.`,
  },
  {
    type: "audit_completed",
    priority: "low",
    title: "Audit completed",
    message: (d) => `The scheduled SEO audit for ${d} finished successfully.`,
  },
  {
    type: "report_generated",
    priority: "low",
    title: "Report generated",
    message: (d) => `The monthly SEO report for ${d} is ready to review.`,
  },
  {
    type: "competitor_change",
    priority: "medium",
    title: "Competitor movement detected",
    message: (d) => `A tracked competitor of ${d} published new content targeting shared keywords.`,
  },
  {
    type: "keyword_opportunity",
    priority: "opportunity",
    title: "New keyword opportunity",
    message: (d) => `A high-value keyword opportunity was identified for ${d}.`,
  },
  {
    type: "new_backlink",
    priority: "low",
    title: "New backlink acquired",
    message: (d) => `${d} earned a new referring domain.`,
  },
  {
    type: "lost_backlink",
    priority: "medium",
    title: "Backlink lost",
    message: (d) => `${d} lost a previously active backlink.`,
  },
];

export const notifications: Notification[] = websites.flatMap((website, wi) => {
  const rng = rngFor(`notif-${website.id}`);
  const client = clients.find((c) => c.id === website.clientId)!;
  const count = randInt(rng, 2, 5);

  return Array.from({ length: count }, (_, i) => {
    const template = pick(rng, TEMPLATES);
    return {
      id: makeId(`notif-${wi}`, i + 1),
      type: template.type,
      priority: template.priority,
      title: template.title,
      message: template.message(website.domain),
      websiteId: website.id,
      clientId: client.id,
      isRead: chance(rng, 0.4),
      createdAt: daysAgo(randInt(rng, 0, 12)),
      href: "/notifications",
    };
  });
});

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.isRead).length;
}

export function getRecentNotifications(limit = 8): Notification[] {
  return [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
