import type { WebsitePage } from "@/types";

export interface OnPageFlags {
  titleIssue: boolean;
  metaDescriptionIssue: boolean;
  h1Issue: boolean;
  imagesIssue: boolean;
}

/** Shared on-page issue rules, used by both the stat cards and the DataTable columns. */
export function getOnPageFlags(page: WebsitePage): OnPageFlags {
  return {
    titleIssue: page.titleLength < 30 || page.titleLength > 60,
    metaDescriptionIssue: page.metaDescriptionLength === 0 || page.metaDescriptionLength > 160,
    h1Issue: page.h1Count !== 1,
    imagesIssue: page.imagesMissingAlt > 0,
  };
}

export function countOnPageIssues(page: WebsitePage): number {
  const flags = getOnPageFlags(page);
  return Object.values(flags).filter(Boolean).length;
}
