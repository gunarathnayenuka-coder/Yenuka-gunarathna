import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { ProfileForm } from "@/components/settings/profile-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/mock-data";
import { initials } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/labels";

export default function ProfileSettingsPage() {
  return (
    <>
      <PageHeader
        title="Profile"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Profile" }]}
        description="Manage your personal account details and login security."
      />
      <SettingsNav />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
            <CardDescription>This is how you appear to the rest of your team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{currentUser.name}</p>
                <Badge variant="secondary">{ROLE_LABELS[currentUser.role]}</Badge>
              </div>
            </div>
            <Separator />
            <ProfileForm />
          </CardContent>
        </Card>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>Choose a strong password you haven&apos;t used before.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
