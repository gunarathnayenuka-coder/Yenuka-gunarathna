import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Globe,
  ShieldCheck,
  KeyRound,
  PenSquare,
  Swords,
  Link2,
  MapPin,
  BarChart3,
  Bot,
  Zap,
  FileText,
  Bell,
  Settings,
} from "lucide-react";

export interface NavLeaf {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavLeaf[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Agency",
    items: [
      { label: "Clients", href: "/clients", icon: Users },
      { label: "Websites", href: "/websites", icon: Globe },
    ],
  },
  {
    label: "SEO",
    items: [
      {
        label: "SEO Audit",
        href: "/seo-audit",
        icon: ShieldCheck,
        children: [
          { label: "Overview", href: "/seo-audit" },
          { label: "Technical SEO", href: "/seo-audit/technical" },
          { label: "On-Page SEO", href: "/seo-audit/on-page" },
          { label: "Performance", href: "/seo-audit/performance" },
          { label: "Schema", href: "/seo-audit/schema" },
          { label: "Issues", href: "/seo-audit/issues" },
        ],
      },
      {
        label: "Keywords",
        href: "/keywords",
        icon: KeyRound,
        children: [
          { label: "Research", href: "/keywords" },
          { label: "Rankings", href: "/keywords/rankings" },
          { label: "Opportunities", href: "/keywords/opportunities" },
          { label: "Keyword Map", href: "/keywords/map" },
          { label: "Cannibalization", href: "/keywords/cannibalization" },
        ],
      },
      {
        label: "Content",
        href: "/content",
        icon: PenSquare,
        children: [
          { label: "Content Dashboard", href: "/content" },
          { label: "Content Planner", href: "/content/planner" },
          { label: "AI Writer", href: "/content/writer" },
          { label: "Content Audit", href: "/content/audit" },
          { label: "Topic Clusters", href: "/content/clusters" },
        ],
      },
      {
        label: "Competitors",
        href: "/competitors",
        icon: Swords,
        children: [
          { label: "Overview", href: "/competitors" },
          { label: "Keyword Gap", href: "/competitors/keyword-gap" },
          { label: "Content Gap", href: "/competitors/content-gap" },
        ],
      },
      {
        label: "Backlinks",
        href: "/backlinks",
        icon: Link2,
        children: [
          { label: "Overview", href: "/backlinks" },
          { label: "New Backlinks", href: "/backlinks/new" },
          { label: "Lost Backlinks", href: "/backlinks/lost" },
          { label: "Opportunities", href: "/backlinks/opportunities" },
        ],
      },
      { label: "Local SEO", href: "/local-seo", icon: MapPin },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Analytics",
        href: "/analytics/gsc",
        icon: BarChart3,
        children: [
          { label: "Search Console", href: "/analytics/gsc" },
          { label: "Google Analytics", href: "/analytics/ga4" },
        ],
      },
      { label: "AI Assistant", href: "/ai-assistant", icon: Bot },
      { label: "Automation", href: "/automation", icon: Zap },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        children: [
          { label: "Profile", href: "/settings" },
          { label: "Organization", href: "/settings/organization" },
          { label: "Users & Roles", href: "/settings/users" },
          { label: "Integrations", href: "/settings/integrations" },
          { label: "AI Settings", href: "/settings/ai" },
          { label: "Security", href: "/settings/security" },
        ],
      },
    ],
  },
];
