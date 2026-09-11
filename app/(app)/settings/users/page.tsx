import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { UsersTable } from "@/components/settings/users-table";
import { InviteUserDialog } from "@/components/settings/invite-user-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser, ROLE_PERMISSIONS, users } from "@/lib/mock-data";

export default function UsersSettingsPage() {
  return (
    <>
      <PageHeader
        title="Users & Roles"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Users & Roles" }]}
        description="Manage who has access to your agency's workspace, and what each role can do."
        actions={<InviteUserDialog />}
      />
      <SettingsNav />
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <UsersTable data={users} currentUserId={currentUser.id} />

        <Card>
          <CardHeader>
            <CardTitle>Roles & permissions</CardTitle>
            <CardDescription>What each role can see and do across Aviance SEO OS.</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <Accordion>
              {ROLE_PERMISSIONS.map((rolePermission) => {
                const memberCount = users.filter((user) => user.role === rolePermission.role).length;
                return (
                  <AccordionItem key={rolePermission.role} value={rolePermission.role} className="px-2">
                    <AccordionTrigger>
                      <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-2 text-left">
                        <span className="font-medium">{rolePermission.label}</span>
                        <Badge variant="outline">
                          {memberCount} member{memberCount === 1 ? "" : "s"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2.5">
                      <p className="text-sm text-muted-foreground">{rolePermission.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rolePermission.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="font-mono text-[11px]">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
