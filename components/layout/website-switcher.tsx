"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clients, websites } from "@/lib/mock-data";
import { resolveWebsiteId } from "@/lib/website-context";

export function WebsiteSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentWebsiteId = resolveWebsiteId(searchParams.get("site") ?? undefined);

  function handleChange(websiteId: string | null) {
    if (!websiteId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("site", websiteId);
    router.push(`${pathname}?${params.toString()}`);
  }

  const clientsById = new Map(clients.map((c) => [c.id, c]));

  return (
    <Select value={currentWebsiteId} onValueChange={handleChange}>
      <SelectTrigger className="w-[240px]" size="sm">
        <Globe className="size-4 text-muted-foreground" />
        <SelectValue placeholder="Select a website">
          {(value: string | null) => websites.find((w) => w.id === value)?.domain ?? "Select a website"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Websites</SelectLabel>
          {websites.map((website) => (
            <SelectItem key={website.id} value={website.id}>
              <div className="flex flex-col">
                <span className="font-medium">{website.domain}</span>
                <span className="text-xs text-muted-foreground">
                  {clientsById.get(website.clientId)?.name ?? "Unknown client"}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
