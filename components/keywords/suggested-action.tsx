import { cn } from "cn";
import { FilePlus, Link2, Sparkles, Wrench } from "lucide-react";
import type { KeywordOpportunity } from "@/types";

export const SUGGESTED_ACTION_CONFIG: Record<
  KeywordOpportunity["suggestedAction"],
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  create_content: { label: "Create content", icon: FilePlus },
  optimize_existing: { label: "Optimize existing page", icon: Sparkles },
  build_links: { label: "Build backlinks", icon: Link2 },
  fix_technical: { label: "Fix technical issue", icon: Wrench },
};

export function SuggestedActionBadge({
  action,
  className,
}: {
  action: KeywordOpportunity["suggestedAction"];
  className?: string;
}) {
  const config = SUGGESTED_ACTION_CONFIG[action];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground",
        className,
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}
