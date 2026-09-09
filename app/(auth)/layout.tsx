import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, TrendingUp } from "lucide-react";

const HIGHLIGHTS = [
  { icon: TrendingUp, text: "Track rankings, traffic and SEO health across every client in one place." },
  { icon: Zap, text: "Automated audits and daily AI recommendations — no manual busywork." },
  { icon: ShieldCheck, text: "Enterprise-grade roles and permissions built for agency teams." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-navy p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--brand-accent), transparent 78%), transparent 55%), radial-gradient(circle at 80% 70%, color-mix(in oklch, var(--brand-accent), transparent 85%), transparent 50%)",
          }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-lg font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="size-4" />
          </div>
          Aviance SEO OS
        </Link>
        <div className="relative z-10 space-y-8">
          <blockquote className="space-y-3">
            <p className="text-2xl leading-snug font-medium text-balance">
              &ldquo;The AI SEO command center for agencies that manage more than one client.&rdquo;
            </p>
            <footer className="text-sm text-white/60">
              Audits, keywords, content, competitors and reporting — automated end to end.
            </footer>
          </blockquote>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.text} className="flex items-start gap-3 text-sm text-white/80">
                <h.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                {h.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-white/40">© 2026 Aviance Digital Solutions. All rights reserved.</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
