"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { NAV_GROUPS } from "@/components/layout/nav-config";

/** Reuses the sidebar's own Settings > children list as the single source of truth for these links. */
const SETTINGS_LINKS = NAV_GROUPS.flatMap((group) => group.items).find((item) => item.href === "/settings")?.children ?? [];

/** Small Tabs-like row linking between the six settings pages, shown below the PageHeader on each one. */
export function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-background px-4 py-3 md:px-6">
      <nav className="inline-flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1 sm:w-fit">
        {SETTINGS_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
