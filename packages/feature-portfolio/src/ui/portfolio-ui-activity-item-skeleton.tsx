import { Skeleton } from '@workspace/ui/components/skeleton'

export function PortfolioUiActivityItemSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="size-3" />
      </div>
      <Skeleton className="h-3.5 w-16" />
    </div>
  )
}
