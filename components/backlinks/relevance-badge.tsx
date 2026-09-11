import { cn } from "cn";
import type { ReferringDomain } from "@/types";

type Relevance = ReferringDomain["relevance"];

const RELEVANCE_CONFIG: Record<Relevance, { label: string; className: string }> = {
  high: { label: "High relevance", className: "bg-success/10 text-success border-success/20" },
  medium: { label: "Medium relevance", className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low relevance", className: "bg-muted text-muted-foreground border-border" },
};

/** Relevance pill shared by referring domains and link opportunities. */
export function RelevanceBadge({ relevance, className }: { relevance: Relevance; className?: string }) {
  const config = RELEVANCE_CONFIG[relevance];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
