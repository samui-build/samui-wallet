import type { Network } from '@workspace/db/entity/network'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { type ReactNode, useMemo } from 'react'

import { PortfolioUiWalletGuard } from './portfolio-ui-wallet-guard.tsx'

export interface PortfolioUiNetworkGuardProps {
  fallback?: ReactNode
  render: (props: { network: Network }) => ReactNode
}

export function PortfolioUiNetworkGuard({
  fallback = <div>Network not selected</div>,
  render,
}: PortfolioUiNetworkGuardProps) {
  const networkLive = useDbNetworkLive()
  const [activeId] = useDbSetting('activeNetworkId')
  const network = useMemo(() => networkLive.find((item) => item.id === activeId), [activeId, networkLive])

  return network ? render({ network }) : fallback
}

export function PortfolioUiNetworkWalletGuard({
  render,
}: {
  render: (props: { network: Network; wallet: Wallet }) => ReactNode
}) {
  return (
    <PortfolioUiNetworkGuard
      render={({ network }) => <PortfolioUiWalletGuard render={({ wallet }) => render({ network, wallet })} />}
    />
  )
}
