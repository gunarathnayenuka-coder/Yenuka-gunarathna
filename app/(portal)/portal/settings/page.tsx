import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalNotificationSettings } from "@/components/portal/notification-settings";
import { fetchClient } from "@/lib/services/clients";
import { resolvePortalClientIdFromSearchParams } from "@/lib/portal-context";
import type { SearchParams } from "@/lib/website-context";

export default async function PortalSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const clientId = await resolvePortalClientIdFromSearchParams(searchParams);
  const client = (await fetchClient(clientId))!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your contact details and notification preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact information</CardTitle>
          <CardDescription>This is how we reach your team. Contact your account manager to make changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Company</span>
            <span className="font-medium">{client.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Primary contact</span>
            <span className="font-medium">{client.contactName}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{client.contactEmail}</span>
          </div>
          {client.contactPhone && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{client.contactPhone}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">
                {client.address.city}, {client.address.country}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription>Choose what we email you about.</CardDescription>
        </CardHeader>
        <CardContent>
          <PortalNotificationSettings />
        </CardContent>
      </Card>
    </div>
  );
}
