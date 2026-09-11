import { clients, getWebsiteById } from "@/lib/mock-data";
import { PRIMARY_WEBSITE_ID, type SearchParams } from "@/lib/website-context";

/** Client that owns the richest-data demo website — used until real per-client portal login exists. */
const DEFAULT_PORTAL_CLIENT_ID = getWebsiteById(PRIMARY_WEBSITE_ID)!.clientId;

/**
 * Resolves which client the portal should render data for. The "current
 * client" is carried in the `?client=` search param (not client state) so
 * server components can read it directly — mirrors `resolveWebsiteId` in
 * `lib/website-context.ts`. A real per-client-login concept can replace this
 * later without touching individual portal pages.
 */
export function resolvePortalClientId(clientIdParam?: string): string {
  if (clientIdParam && clients.some((c) => c.id === clientIdParam)) return clientIdParam;
  return DEFAULT_PORTAL_CLIENT_ID;
}

export async function resolvePortalClientIdFromSearchParams(searchParams: SearchParams): Promise<string> {
  const params = await searchParams;
  const value = Array.isArray(params.client) ? params.client[0] : params.client;
  return resolvePortalClientId(value);
}
