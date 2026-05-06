import { Skeleton } from '@workspace/ui/components/skeleton'

export function PortfolioUiTokenBalanceItemSkeleton() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex size-14 items-center justify-center">
          <Skeleton className="size-12 rounded-full" />
        </div>
        <div className="mr-6 flex flex-col items-start">
          <Skeleton className="mb-2 h-5 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
      <div className="flex grow flex-col items-end">
        <Skeleton className="mb-1 h-6 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  )
}
