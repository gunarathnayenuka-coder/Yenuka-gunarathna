import type { Role, SearchIntent } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  agency_owner: "Agency Owner",
  seo_manager: "SEO Manager",
  seo_specialist: "SEO Specialist",
  content_writer: "Content Writer",
  client: "Client",
};

export const INTENT_LABELS: Record<SearchIntent, string> = {
  informational: "Informational",
  navigational: "Navigational",
  commercial: "Commercial",
  transactional: "Transactional",
};

export const INTENT_BADGE_CLASS: Record<SearchIntent, string> = {
  informational: "bg-info/10 text-info border-info/20",
  navigational: "bg-muted text-muted-foreground border-border",
  commercial: "bg-warning/10 text-warning border-warning/20",
  transactional: "bg-success/10 text-success border-success/20",
};
