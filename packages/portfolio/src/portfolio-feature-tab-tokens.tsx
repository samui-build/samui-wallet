import { useMemo } from 'react'

import type { ClusterWallet } from './portfolio-routes-loaded.js'

import { useGetTokenBalances } from './data-access/use-get-token-metadata.js'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.js'
import { PortfolioUiWalletButtons } from './ui/portfolio-ui-wallet-buttons.js'

export function PortfolioFeatureTabTokens(props: ClusterWallet) {
  const balances = useGetTokenBalances(props)

  const totalBalance = useMemo(() => {
    const balance = balances.reduce((acc, item) => {
      if (!item.metadata?.usdPrice) {
        return acc
      }
      const itemBalance = (Number(item.balance) / 10 ** item.decimals) * item.metadata.usdPrice
      return acc + itemBalance
    }, 0)

    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(balance)
  }, [balances])

  return (
    <div className="p-4 space-y-6">
      <div className="text-4xl font-bold text-center">$ {totalBalance}</div>
      <PortfolioUiWalletButtons {...props} />
      <PortfolioUiTokenBalances items={balances} />
    </div>
  )
}
