"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { Copy, KeyRound, Laptop, RefreshCw, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SessionEntry {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  icon: LucideIcon;
  current?: boolean;
}

// Fabricated, read-only entries — not domain data, so a plain local array is enough.
const SESSIONS: SessionEntry[] = [
  {
    id: "sess-1",
    device: "Chrome on macOS",
    location: "Colombo, Sri Lanka",
    lastActive: "Active now",
    icon: Laptop,
    current: true,
  },
  {
    id: "sess-2",
    device: "Aviance mobile app · iPhone",
    location: "Colombo, Sri Lanka",
    lastActive: "1 day ago",
    icon: Smartphone,
  },
];

function randomKeySuffix(): string {
  return Math.random().toString(16).slice(2, 10);
}

export function SecurityPanel() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [keySuffix, setKeySuffix] = useState("7a41f9c2");

  function handleToggleTwoFactor(checked: boolean) {
    setTwoFactorEnabled(checked);
    toast.success(checked ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
  }

  async function handleCopyKey() {
    const key = `avn_live_••••••••••••${keySuffix}`;
    try {
      await navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the key — copy it manually instead.");
    }
  }

  function handleRegenerateKey() {
    setKeySuffix(randomKeySuffix());
    toast.success("API key regenerated. Update any integrations using the old key.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Add an extra step when signing in to protect your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3.5">
            <div className="min-w-0 space-y-0.5">
              <Label htmlFor="twoFactor" className="text-sm font-medium">
                Require a verification code at sign-in
              </Label>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled
                  ? "Enabled — you'll be asked for a code from your authenticator app."
                  : "Currently disabled for your account."}
              </p>
            </div>
            <Switch id="twoFactor" checked={twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {SESSIONS.map((session) => (
            <div key={session.id} className="flex items-center gap-3 rounded-lg border p-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <session.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {session.device}
                  {session.current && <Badge variant="secondary">This device</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.location} · {session.lastActive}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API keys</CardTitle>
          <CardDescription>Use this key to authenticate requests from your own tools and scripts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
            <KeyRound className="size-4 shrink-0 text-muted-foreground" />
            <code className="min-w-0 flex-1 truncate text-sm">avn_live_••••••••••••{keySuffix}</code>
            <Button variant="ghost" size="icon-sm" aria-label="Copy API key" onClick={handleCopyKey}>
              <Copy />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleRegenerateKey}>
            <RefreshCw /> Regenerate key
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
