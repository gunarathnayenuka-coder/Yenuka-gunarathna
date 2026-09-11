import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PortalNav } from "@/components/portal/portal-nav";

export const metadata: Metadata = {
  title: "Client Portal",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-6">
          <Link href="/portal" className="flex items-center gap-2.5">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <div className="grid leading-tight">
              <span className="truncate text-sm font-semibold">Aviance</span>
              <span className="truncate text-xs text-muted-foreground">Client Portal</span>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
        <PortalNav />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">{children}</main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">Powered by Aviance SEO OS</footer>
    </div>
  );
}
