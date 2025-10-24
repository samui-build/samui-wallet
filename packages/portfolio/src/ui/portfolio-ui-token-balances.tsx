import type { TokenBalance } from '../data-access/use-get-token-metadata.js'

import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.js'

export function PortfolioUiTokenBalances({ items }: { items: TokenBalance[] }) {
  return items.map((item) => <PortfolioUiTokenBalanceItem item={item} key={item.mint} />)
}
