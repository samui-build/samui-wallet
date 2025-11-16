import { Skeleton } from '@workspace/ui/components/skeleton'

export function PortfolioUiTokenBalanceItemSkeleton() {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <div className="flex justify-center items-center size-14">
          <Skeleton className="size-12 rounded-full" />
        </div>
        <div className="flex flex-col items-start mr-6">
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
      <div className="flex flex-col items-end grow">
        <Skeleton className="h-6 w-16 mb-1" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  )
}
