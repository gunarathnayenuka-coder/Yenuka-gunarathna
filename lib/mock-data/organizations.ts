import type { Organization, Role, RolePermissions, User } from "@/types";
import { daysAgo, makeId, pick, randInt, rngFor } from "./rng";
import { PERSON_FIRST_NAMES, PERSON_LAST_NAMES } from "./constants";

export const organization: Organization = {
  id: "org_0001",
  name: "Aviance Digital Solutions",
  plan: "agency",
  seatsUsed: 8,
  seatsLimit: 15,
  createdAt: daysAgo(420),
};

const USER_SEEDS: { name: string; email: string; role: Role }[] = [
  { name: "Yenuka Gunarathna", email: "tilanpathirage00@gmail.com", role: "agency_owner" },
  { name: "Nadeesha Perera", email: "nadeesha@avianceseo.com", role: "seo_manager" },
  { name: "Kasun Fernando", email: "kasun@avianceseo.com", role: "seo_specialist" },
  { name: "Ishara Jayasuriya", email: "ishara@avianceseo.com", role: "seo_specialist" },
  { name: "Sanduni Bandara", email: "sanduni@avianceseo.com", role: "content_writer" },
  { name: "Tharindu Silva", email: "tharindu@avianceseo.com", role: "content_writer" },
  { name: "Dilani Karunaratne", email: "dilani@avianceseo.com", role: "super_admin" },
];

export const users: User[] = USER_SEEDS.map((seed, index) => {
  const rng = rngFor(`user-${index}`);
  return {
    id: makeId("user", index + 1),
    name: seed.name,
    email: seed.email,
    role: seed.role,
    organizationId: organization.id,
    lastActiveAt: daysAgo(randInt(rng, 0, 5)),
    createdAt: daysAgo(randInt(rng, 60, 400)),
  };
});

export const currentUser: User = users[0];

export function randomPersonName(seed: string): string {
  const rng = rngFor(`person-${seed}`);
  return `${pick(rng, PERSON_FIRST_NAMES)} ${pick(rng, PERSON_LAST_NAMES)}`;
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: "super_admin",
    label: "Super Admin",
    description: "Full platform access across every organization, billing, and system settings.",
    permissions: ["*"],
  },
  {
    role: "agency_owner",
    label: "Agency Owner",
    description: "Full access to all clients, billing, users, and settings within the agency.",
    permissions: ["clients:*", "billing:*", "users:*", "settings:*", "reports:*"],
  },
  {
    role: "seo_manager",
    label: "SEO Manager",
    description: "Manages audits, keywords, reports, and task assignment across clients.",
    permissions: ["audits:*", "keywords:*", "reports:*", "tasks:*", "clients:read"],
  },
  {
    role: "seo_specialist",
    label: "SEO Specialist",
    description: "Executes audits, resolves issues, and manages keyword tracking.",
    permissions: ["audits:read", "audits:write", "keywords:read", "keywords:write", "tasks:write"],
  },
  {
    role: "content_writer",
    label: "Content Writer",
    description: "Creates and edits content briefs, drafts, and on-page copy.",
    permissions: ["content:*"],
  },
  {
    role: "client",
    label: "Client",
    description: "Read-only access to their own website's performance, reports, and recommendations.",
    permissions: ["portal:read"],
  },
];
