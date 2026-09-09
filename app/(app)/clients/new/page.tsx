"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDUSTRIES, COUNTRIES } from "@/lib/mock-data/constants";

const schema = z.object({
  name: z.string().min(2, "Client name is required"),
  industry: z.string().min(1, "Select an industry"),
  country: z.string().min(1, "Select a country"),
  websiteUrl: z.string().min(1, "Website URL is required").url("Enter a valid URL, e.g. https://example.com"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().min(1, "Contact email is required").email("Enter a valid email"),
  contactPhone: z.string().optional(),
  targetAudience: z.string().optional(),
});
type Values = z.infer<typeof schema>;

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    toast.success(`${values.name} added — starting initial SEO crawl.`);
    router.push("/clients");
  }

  return (
    <>
      <PageHeader
        title="Add client"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Clients", href: "/clients" }, { label: "Add client" }]}
        description="Onboard a new client — we'll kick off the initial SEO crawl automatically."
      />
      <div className="flex-1 p-4 md:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Client details</CardTitle>
            <CardDescription>This information is used across audits, reports and the client portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Client / business name</FieldLabel>
                  <Input id="name" placeholder="Northbridge Legal Partners" {...register("name")} />
                  <FieldError errors={[errors.name]} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.industry}>
                    <FieldLabel htmlFor="industry">Industry</FieldLabel>
                    <Controller
                      control={control}
                      name="industry"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="industry" className="w-full">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.industry]} />
                  </Field>

                  <Field data-invalid={!!errors.country}>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="country" className="w-full">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.country]} />
                  </Field>
                </div>

                <Field data-invalid={!!errors.websiteUrl}>
                  <FieldLabel htmlFor="websiteUrl">Website URL</FieldLabel>
                  <Input id="websiteUrl" placeholder="https://example.com" {...register("websiteUrl")} />
                  <FieldError errors={[errors.websiteUrl]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="targetAudience">Target audience (optional)</FieldLabel>
                  <Textarea id="targetAudience" placeholder="e.g. Homeowners in Colombo looking for licensed electricians" {...register("targetAudience")} />
                </Field>

                <FieldSeparator>Primary contact</FieldSeparator>

                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.contactName}>
                    <FieldLabel htmlFor="contactName">Contact name</FieldLabel>
                    <Input id="contactName" placeholder="Priya Silva" {...register("contactName")} />
                    <FieldError errors={[errors.contactName]} />
                  </Field>
                  <Field data-invalid={!!errors.contactEmail}>
                    <FieldLabel htmlFor="contactEmail">Contact email</FieldLabel>
                    <Input id="contactEmail" type="email" placeholder="priya@client.com" {...register("contactEmail")} />
                    <FieldError errors={[errors.contactEmail]} />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="contactPhone">Contact phone (optional)</FieldLabel>
                  <Input id="contactPhone" placeholder="+94 77 123 4567" {...register("contactPhone")} />
                </Field>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => router.push("/clients")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    Save &amp; start initial crawl
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
