"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, Mail, MapPin, MessageSquare, Plug, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GenericStatusBadge } from "@/components/shared";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  connected: boolean;
}

// UI chrome only — not domain data, so it lives here rather than in lib/mock-data.
const INTEGRATIONS: Integration[] = [
  {
    id: "gsc",
    name: "Google Search Console",
    description: "Pull live indexing, query and ranking data straight from Google.",
    icon: Search,
    connected: true,
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    description: "Sync traffic, conversions and audience data for every website.",
    icon: BarChart3,
    connected: true,
  },
  {
    id: "gbp",
    name: "Google Business Profile",
    description: "Track local rankings, reviews and listing accuracy.",
    icon: MapPin,
    connected: false,
  },
  {
    id: "seo-api",
    name: "Third-party SEO API",
    description: "Connect an external rank-tracking or backlink data provider.",
    icon: Plug,
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send ranking alerts and AI recommendations to a Slack channel.",
    icon: MessageSquare,
    connected: false,
  },
  {
    id: "smtp",
    name: "Email / SMTP",
    description: "Deliver scheduled client reports from your own sending domain.",
    icon: Mail,
    connected: true,
  },
];

export function IntegrationsPanel() {
  function handleClick(integration: Integration) {
    if (integration.connected) {
      toast.info(`This is a demo — disconnecting ${integration.name} isn't wired up yet.`);
      return;
    }
    toast.info("This is a demo — connect flows will be wired up with the backend integration.");
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {INTEGRATIONS.map((integration) => {
        const Icon = integration.icon;
        return (
          <Card key={integration.id}>
            <CardContent className="flex h-full flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <GenericStatusBadge status={integration.connected ? "active" : "not_connected"} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
                className="mt-auto w-full"
                onClick={() => handleClick(integration)}
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
