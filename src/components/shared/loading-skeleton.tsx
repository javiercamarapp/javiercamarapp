import { cn } from "@/lib/utils"

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-6 space-y-4">
      <LoadingSkeleton className="h-4 w-1/3" />
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-3 w-2/3" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
