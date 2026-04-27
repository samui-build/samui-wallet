import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { bigIntToDecimal } from '@workspace/solana-client/big-int-to-decimal'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { useMemo } from 'react'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import { PortfolioUiAccountButtons } from './ui/portfolio-ui-account-buttons.tsx'
import { PortfolioUiBalance } from './ui/portfolio-ui-balance.tsx'
import { PortfolioUiBalanceSkeleton } from './ui/portfolio-ui-balance-skeleton.tsx'
import { PortfolioUiRequestAirdrop } from './ui/portfolio-ui-request-airdrop.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'
import { PortfolioUiTokenBalancesSkeleton } from './ui/portfolio-ui-token-balances-skeleton.tsx'

export function PortfolioFeatureTabTokens({ address, network }: { address: Address; network: Network }) {
  const balances = useGetTokenBalances({ address, network })
  const { data: dataWalletInfo, isLoading: isLoadingWalletInfo } = useGetAccountInfo({
    address,
    network,
  })
  const totalBalance = useMemo(() => {
    const balance = balances.reduce((acc, item) => {
      if (!item.metadata?.usdPrice) {
        return acc
      }
      const itemBalance = bigIntToDecimal(item.balance, item.decimals) * item.metadata.usdPrice
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
        <PortfolioUiRequestAirdrop address={address} lamports={dataWalletInfo?.value?.lamports} network={network} />
      )}

      {isLoadingWalletInfo ? (
        <PortfolioUiTokenBalancesSkeleton length={3} />
      ) : (
        <PortfolioUiTokenBalances items={balances} />
      )}
    </div>
  )
}
