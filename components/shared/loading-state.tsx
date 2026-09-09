import { Skeleton } from "@/components/ui/skeleton";

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-full rounded-md" />
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton key={c} className="h-8 flex-1 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className = "h-72" }: { className?: string }) {
  return <Skeleton className={`w-full rounded-lg ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <CardGridSkeleton />
      <ChartSkeleton />
      <TableSkeleton />
    </div>
  );
}
