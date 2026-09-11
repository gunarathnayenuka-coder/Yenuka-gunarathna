"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Role, User } from "@/types";
import { ConfirmDialog } from "@/components/shared";
import { DataTable } from "@/components/shared/data-table";
import { ROLE_LABELS } from "@/lib/labels";
import { ChangeRoleDialog } from "./change-role-dialog";
import { buildUserColumns } from "./user-columns";

export function UsersTable({ data, currentUserId }: { data: User[]; currentUserId: string }) {
  const [rolesById, setRolesById] = useState<Record<string, Role>>(() =>
    Object.fromEntries(data.map((user) => [user.id, user.role])),
  );
  const [roleDialogUser, setRoleDialogUser] = useState<User | null>(null);
  // A fresh object on every request (even for the same user) so the effect below always re-fires.
  const [removeRequest, setRemoveRequest] = useState<{ user: User } | null>(null);
  // ConfirmDialog owns its own open state via this trigger, so the row action programmatically
  // clicks a persistently-mounted (visually hidden) trigger instead of nesting the dialog inside
  // the DropdownMenu, whose popup unmounts — and would take a nested dialog with it — on close.
  const removeTriggerRef = useRef<HTMLButtonElement>(null);

  const handleChangeRole = useCallback((user: User) => {
    setRoleDialogUser(user);
  }, []);

  const handleApplyRole = useCallback((user: User, role: Role) => {
    setRolesById((prev) => ({ ...prev, [user.id]: role }));
    toast.success(`${user.name}'s role changed to ${ROLE_LABELS[role]}.`);
    setRoleDialogUser(null);
  }, []);

  // Kept ref-free so it's safe to hand to buildUserColumns, which runs during render (in useMemo
  // below) — refs must only ever be read from an effect or event handler, never during render.
  const handleRequestRemove = useCallback((user: User) => {
    setRemoveRequest({ user });
  }, []);

  // Reading/clicking the ref here (not in handleRequestRemove itself) keeps that read out of render.
  useEffect(() => {
    if (removeRequest) {
      removeTriggerRef.current?.click();
    }
  }, [removeRequest]);

  const handleConfirmRemove = useCallback(() => {
    if (!removeRequest) return;
    toast.success(`${removeRequest.user.name} was removed from the organization.`);
  }, [removeRequest]);

  const columns = useMemo(
    () =>
      buildUserColumns({
        currentUserId,
        rolesById,
        onChangeRole: handleChangeRole,
        onRequestRemove: handleRequestRemove,
      }),
    [currentUserId, rolesById, handleChangeRole, handleRequestRemove],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search users..."
        pageSize={8}
        emptyTitle="No users yet"
        emptyDescription="Invite teammates to collaborate on client SEO."
      />

      <ChangeRoleDialog
        user={roleDialogUser}
        open={!!roleDialogUser}
        onOpenChange={(open) => !open && setRoleDialogUser(null)}
        onApply={handleApplyRole}
      />

      <ConfirmDialog
        trigger={<button ref={removeTriggerRef} type="button" className="hidden" aria-hidden tabIndex={-1} />}
        title="Remove user"
        description={
          removeRequest
            ? `Remove ${removeRequest.user.name} from your organization? They will immediately lose access to every client and website.`
            : "Remove this user from your organization?"
        }
        confirmLabel="Remove user"
        destructive
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
