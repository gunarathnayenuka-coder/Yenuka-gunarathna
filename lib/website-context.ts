import { websites } from "@/lib/mock-data";

/** Richest-data demo website, used whenever no explicit selection is present. */
export const PRIMARY_WEBSITE_ID = websites[0].id;

/**
 * Resolves which website a page should render data for. The "current
 * website" is carried in the `?site=` search param (not client state) so
 * server components can read it directly — see WebsiteSwitcher, which
 * updates the param on change.
 */
export function resolveWebsiteId(siteParam?: string | string[]): string {
  const value = Array.isArray(siteParam) ? siteParam[0] : siteParam;
  if (value && websites.some((w) => w.id === value)) return value;
  return PRIMARY_WEBSITE_ID;
}

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function resolveWebsiteIdFromSearchParams(searchParams: SearchParams): Promise<string> {
  const params = await searchParams;
  return resolveWebsiteId(params.site);
}
