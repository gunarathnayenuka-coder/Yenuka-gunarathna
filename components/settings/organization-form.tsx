"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { organization } from "@/lib/mock-data";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
});
type OrganizationValues = z.infer<typeof organizationSchema>;

export function OrganizationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: organization.name },
  });

  async function onSubmit(values: OrganizationValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    toast.success(`Organization name updated to "${values.name}".`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="orgName">Organization name</FieldLabel>
          <Input id="orgName" placeholder="Your agency's name" {...register("name")} />
          <FieldError errors={[errors.name]} />
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
