import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useGetTokenAccounts } from '@workspace/solana-client-react/use-get-token-accounts'
import { UiLoader } from '@workspace/ui/components/ui-loader'

import { AccountUiTokens } from './ui/portfolio-ui-tokens.js'

export function PortfolioFeatureGetTokenAccounts(props: { cluster: Cluster; wallet: Wallet }) {
  const { data, isLoading } = useGetTokenAccounts(props)

  if (isLoading) {
    return <UiLoader />
  }

  return <AccountUiTokens cluster={props.cluster} items={data ?? []} />
}
