import type { LucideIcon } from "lucide-react";
import { FileText, KeyRound, LayoutDashboard, Settings, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export interface PortalNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * The client portal's entire nav surface — deliberately small and outcome-focused.
 * No agency-internal tool names (Automation, Competitors, Backlinks, Content tooling, etc.).
 */
export const PORTAL_NAV_ITEMS: PortalNavItem[] = [
  { label: "Overview", href: "/portal", icon: LayoutDashboard },
  { label: "Performance", href: "/portal/performance", icon: TrendingUp },
  { label: "Keywords", href: "/portal/keywords", icon: KeyRound },
  { label: "SEO Issues", href: "/portal/issues", icon: ShieldCheck },
  { label: "Reports", href: "/portal/reports", icon: FileText },
  { label: "Recommendations", href: "/portal/recommendations", icon: Sparkles },
  { label: "Settings", href: "/portal/settings", icon: Settings },
];
