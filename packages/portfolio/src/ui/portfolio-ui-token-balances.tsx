import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'

import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiTokenBalances({ items }: { items: TokenBalance[] }) {
  return items.map((item) => <PortfolioUiTokenBalanceItem item={item} key={item.mint} />)
}
