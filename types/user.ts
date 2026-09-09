import type { PlanTier, Role } from "./common";

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  plan: PlanTier;
  seatsUsed: number;
  seatsLimit: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  organizationId: string;
  clientId?: string; // set when role === "client"
  lastActiveAt: string;
  createdAt: string;
}

export interface RolePermissions {
  role: Role;
  label: string;
  description: string;
  permissions: string[];
}
