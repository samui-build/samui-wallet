import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { ExplorerUiRequestAirdrop } from '@workspace/explorer/ui/explorer-ui-request-airdrop'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { useMemo } from 'react'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import { PortfolioUiAccountButtons } from './ui/portfolio-ui-account-buttons.tsx'
import { PortfolioUiBalance } from './ui/portfolio-ui-balance.tsx'
import { PortfolioUiBalanceSkeleton } from './ui/portfolio-ui-balance-skeleton.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'
import { PortfolioUiTokenBalancesSkeleton } from './ui/portfolio-ui-token-balances-skeleton.tsx'

export function PortfolioFeatureTabTokens() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const balances = useGetTokenBalances({ address: account.publicKey, network })
  const { data: dataWalletInfo, isLoading: isLoadingWalletInfo } = useGetAccountInfo({
    address: account.publicKey,
    network,
  })
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
      minimumFractionDigits: 2,
    }).format(balance)
  }, [balances])

  return (
    <div className="space-y-2 px-2 md:space-y-6 md:px-0">
      {isLoadingWalletInfo ? <PortfolioUiBalanceSkeleton /> : <PortfolioUiBalance balance={totalBalance} />}

      <PortfolioUiAccountButtons />

      {isLoadingWalletInfo ? null : (
        <ExplorerUiRequestAirdrop address={account.publicKey} lamports={dataWalletInfo?.lamports} network={network} />
      )}

      {isLoadingWalletInfo ? (
        <PortfolioUiTokenBalancesSkeleton length={3} />
      ) : (
        <PortfolioUiTokenBalances items={balances} />
      )}
    </div>
  )
}
