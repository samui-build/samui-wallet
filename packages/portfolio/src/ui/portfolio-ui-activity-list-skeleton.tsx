import { Skeleton } from '@workspace/ui/components/skeleton'
import { PortfolioUiActivityItemSkeleton } from './portfolio-ui-activity-item-skeleton.tsx'

export function PortfolioUiActivityListSkeleton({ length = 5 }: { length?: number }) {
  return (
    <div>
      <div className="space-y-4">
        {Array.from({ length }, (_, i) => i).map((id) => (
          <div className="space-y-4" key={id}>
            <div className="flex gap-2">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              {Array.from({ length }, (_, i) => i).map((id) => (
                <PortfolioUiActivityItemSkeleton key={id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
