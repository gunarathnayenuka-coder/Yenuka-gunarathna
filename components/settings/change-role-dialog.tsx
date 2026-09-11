"use client";

import { useState } from "react";
import type { Role, User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_PERMISSIONS } from "@/lib/mock-data";

export function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
  onApply,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (user: User, role: Role) => void;
}) {
  const [role, setRole] = useState<Role | undefined>(user?.role);
  // Tracks the user this dialog was last rendered for, so we can reset `role` during render
  // (React's recommended way to adjust state when a prop changes) instead of in an effect —
  // this dialog stays mounted across different rows, only `user`/`open` change.
  const [lastUser, setLastUser] = useState(user);
  if (user !== lastUser) {
    setLastUser(user);
    setRole(user?.role);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {user && (
          <>
            <DialogHeader>
              <DialogTitle>Change role</DialogTitle>
              <DialogDescription>Update what {user.name} can access across Aviance SEO OS.</DialogDescription>
            </DialogHeader>

            <Select value={role} onValueChange={(value) => setRole(value ?? user.role)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_PERMISSIONS.map((rolePermission) => (
                  <SelectItem key={rolePermission.role} value={rolePermission.role}>
                    {rolePermission.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="button" onClick={() => role && onApply(user, role)}>
                Apply
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
