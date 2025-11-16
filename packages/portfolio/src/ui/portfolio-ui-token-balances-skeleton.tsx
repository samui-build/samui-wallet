import { PortfolioUiTokenBalanceItemSkeleton } from './portfolio-ui-token-balance-item-skeleton.tsx'

export function PortfolioUiTokenBalancesSkeleton({ length }: { length: number }) {
  return Array.from({ length }, (_, i) => i).map((index) => <PortfolioUiTokenBalanceItemSkeleton key={index} />)
}
