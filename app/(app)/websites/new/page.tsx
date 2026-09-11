"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Globe, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "cn";
import { clients } from "@/lib/mock-data";
import { COUNTRIES } from "@/lib/mock-data/constants";

const STEPS = ["Website URL", "Client", "Region & engine", "Crawl setup", "Finish"] as const;

export default function NewWebsitePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [url, setUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [country, setCountry] = useState("Sri Lanka");
  const [searchEngine, setSearchEngine] = useState<"google" | "bing">("google");
  const [crawlDepth, setCrawlDepth] = useState("standard");

  const canProceed = [url.trim().length > 3, !!clientId, !!country && !!searchEngine, !!crawlDepth, true][step];

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function finish() {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    toast.success(`${url || "Website"} added — initial crawl started.`);
    router.push("/websites");
  }

  const selectedClient = clients.find((c) => c.id === clientId);

  return (
    <>
      <PageHeader
        title="Add website"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Websites", href: "/websites" }, { label: "Add website" }]}
        description="Connect a new website and we'll run the initial SEO crawl automatically."
      />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <ol className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i < step ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span className={cn("hidden text-xs sm:inline", i === step ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
              </li>
            ))}
          </ol>

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
              <CardDescription>Step {step + 1} of {STEPS.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="url" className="pl-8" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter the full URL including https://</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="client">Belongs to client</Label>
                  <Select value={clientId} onValueChange={(value) => setClientId(value ?? "")}>
                    <SelectTrigger id="client" className="w-full">
                      <SelectValue placeholder="Select a client">
                        {(value: string | null) => clients.find((c) => c.id === value)?.name ?? "Select a client"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="country">Primary target country</Label>
                    <Select value={country} onValueChange={(value) => setCountry(value ?? "Sri Lanka")}>
                      <SelectTrigger id="country" className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Search engine</Label>
                    <RadioGroup value={searchEngine} onValueChange={(v) => setSearchEngine(v as "google" | "bing")} className="flex gap-4">
                      <Label className="flex items-center gap-2 rounded-lg border p-3 text-sm font-normal has-data-checked:border-primary has-data-checked:bg-accent">
                        <RadioGroupItem value="google" /> Google
                      </Label>
                      <Label className="flex items-center gap-2 rounded-lg border p-3 text-sm font-normal has-data-checked:border-primary has-data-checked:bg-accent">
                        <RadioGroupItem value="bing" /> Bing
                      </Label>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-2">
                  <Label>Initial crawl depth</Label>
                  <RadioGroup value={crawlDepth} onValueChange={setCrawlDepth} className="space-y-2">
                    {[
                      { value: "quick", title: "Quick scan", desc: "Up to 50 pages — fastest results" },
                      { value: "standard", title: "Standard", desc: "Up to 500 pages — recommended" },
                      { value: "deep", title: "Deep crawl", desc: "Unlimited pages — most thorough" },
                    ].map((opt) => (
                      <Label
                        key={opt.value}
                        className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm font-normal has-data-checked:border-primary has-data-checked:bg-accent"
                      >
                        <span className="flex items-center gap-2.5">
                          <RadioGroupItem value={opt.value} />
                          <span>
                            <span className="block font-medium text-foreground">{opt.title}</span>
                            <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                          </span>
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Website</dt>
                        <dd className="font-medium">{url || "—"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Client</dt>
                        <dd className="font-medium">{selectedClient?.name ?? "—"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Country</dt>
                        <dd className="font-medium">{country}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Search engine</dt>
                        <dd className="font-medium capitalize">{searchEngine}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Crawl depth</dt>
                        <dd className="font-medium capitalize">{crawlDepth}</dd>
                      </div>
                    </dl>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll start crawling immediately after you finish. Initial results are usually ready within a few minutes.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={back} disabled={step === 0}>
                  <ChevronLeft /> Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={next} disabled={!canProceed}>
                    Next <ChevronRight />
                  </Button>
                ) : (
                  <Button type="button" onClick={finish} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    Save &amp; start initial crawl
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
