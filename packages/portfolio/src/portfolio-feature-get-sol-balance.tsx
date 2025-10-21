import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { lamports } from '@workspace/solana-client'
import { useGetBalance } from '@workspace/solana-client-react/use-get-balance'
import { UiLoader } from '@workspace/ui/components/ui-loader'

import { PortfolioUiBalanceSol } from './ui/portfolio-ui-balance-sol.js'

export function PortfolioFeatureGetSolBalance(props: { cluster: Cluster; wallet: Wallet }) {
  const { data, isLoading } = useGetBalance(props)

  if (isLoading) {
    return <UiLoader />
  }

  return (
    <div className="text-4xl font-bold text-center">
      <PortfolioUiBalanceSol balance={data?.value ?? lamports(0n)} /> SOL
    </div>
  )
}
