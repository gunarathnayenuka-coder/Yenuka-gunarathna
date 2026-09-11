"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { currentUser } from "@/lib/mock-data";

const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string(),
});
type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentUser.name, email: currentUser.email },
  });

  async function onSubmit(values: ProfileValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    toast.success(`Profile updated — ${values.name}.`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" placeholder="Your name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input id="email" type="email" disabled {...register("email")} />
          <FieldDescription>Contact your organization admin to change your login email.</FieldDescription>
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Save changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
