import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { type ReactNode, useMemo } from 'react'

import { PortfolioUiWalletGuard } from './portfolio-ui-wallet-guard.tsx'

export interface PortfolioUiClusterGuardProps {
  fallback?: ReactNode
  render: (props: { cluster: Cluster }) => ReactNode
}

export function PortfolioUiClusterGuard({
  fallback = <div>Cluster not selected</div>,
  render,
}: PortfolioUiClusterGuardProps) {
  const clusterLive = useDbClusterLive()
  const [activeId] = useDbSetting('activeClusterId')
  const cluster = useMemo(() => clusterLive.find((item) => item.id === activeId), [activeId, clusterLive])

  return cluster ? render({ cluster }) : fallback
}

export function PortfolioUiClusterWalletGuard({
  render,
}: {
  render: (props: { cluster: Cluster; wallet: Wallet }) => ReactNode
}) {
  return (
    <PortfolioUiClusterGuard
      render={({ cluster }) => <PortfolioUiWalletGuard render={({ wallet }) => render({ cluster, wallet })} />}
    />
  )
}
