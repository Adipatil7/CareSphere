import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant?: "card" | "table-row" | "list" | "page";
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-border last:border-0">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-md ml-auto" />
    </div>
  );
}

function SkeletonListItem() {
  return (
    <div className="flex items-start gap-3 py-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function LoadingSkeleton({ variant = "card", count = 3 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "page") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-4 py-3 px-4 border-b border-border bg-muted/50">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
        {items.map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-1 divide-y divide-border">
        {items.map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  // Default: card grid
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
