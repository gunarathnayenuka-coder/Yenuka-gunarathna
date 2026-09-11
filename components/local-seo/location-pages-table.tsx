import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "cn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LocationPage } from "@/types";

function scoreTone(value: number): string {
  if (value >= 80) return "text-success";
  if (value >= 60) return "text-warning";
  return "text-critical";
}

/** Small, static table for a website's location pages (typically 1-4 rows) — no search/sort chrome needed at that size. */
export function LocationPagesTable({ data }: { data: LocationPage[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>City</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>SEO Score</TableHead>
            <TableHead>NAP Match</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((page) => {
            let path = page.url;
            try {
              path = new URL(page.url).pathname || "/";
            } catch {
              // Keep the raw value if it's not a fully-qualified URL.
            }
            return (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.city}</TableCell>
                <TableCell>
                  <Link href={page.url} target="_blank" className="inline-flex items-center gap-1 hover:underline">
                    <span className="max-w-56 truncate">{path}</span>
                    <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                  </Link>
                </TableCell>
                <TableCell>
                  <span className={cn("font-medium tabular-nums", scoreTone(page.seoScore))}>{page.seoScore}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                      page.napMatch ? "bg-success/10 text-success border-success/20" : "bg-critical/10 text-critical border-critical/20",
                    )}
                  >
                    {page.napMatch ? "Match" : "Mismatch"}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
