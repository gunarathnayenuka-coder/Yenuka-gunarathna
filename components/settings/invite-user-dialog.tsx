"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_PERMISSIONS } from "@/lib/mock-data";

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  role: z.string().min(1, "Select a role"),
});
type InviteValues = z.infer<typeof inviteSchema>;

const INVITABLE_ROLES = ROLE_PERMISSIONS.filter((rolePermission) => rolePermission.role !== "client");

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "seo_specialist" },
  });

  async function onSubmit(values: InviteValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    toast.success(`Invitation sent to ${values.email}.`);
    setOpen(false);
    reset({ email: "", role: "seo_specialist" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlus /> Invite user
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>Send an invitation to join your organization on Aviance SEO OS.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="inviteEmail">Email address</FieldLabel>
              <Input id="inviteEmail" type="email" placeholder="teammate@agency.com" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.role}>
              <FieldLabel htmlFor="inviteRole">Role</FieldLabel>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => field.onChange(value ?? field.value)}>
                    <SelectTrigger id="inviteRole" className="w-full">
                      <SelectValue placeholder="Select a role">
                        {(value: string | null) =>
                          INVITABLE_ROLES.find((rolePermission) => rolePermission.role === value)?.label ?? "Select a role"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {INVITABLE_ROLES.map((rolePermission) => (
                        <SelectItem key={rolePermission.role} value={rolePermission.role}>
                          {rolePermission.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.role]} />
            </Field>

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                Send invitation
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
