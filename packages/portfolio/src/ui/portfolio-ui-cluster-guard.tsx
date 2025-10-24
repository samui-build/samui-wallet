import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import React, { useMemo } from 'react'

import { PortfolioUiWalletGuard } from './portfolio-ui-wallet-guard.js'

export interface PortfolioUiClusterGuardProps {
  fallback?: React.ReactNode
  render: (props: { cluster: Cluster }) => React.ReactNode
}

export function PortfolioUiClusterGuard({
  fallback = <div>Cluster not selected</div>,
  render,
}: PortfolioUiClusterGuardProps) {
  const clusterLive = useDbClusterLive()
  const [activeId] = useDbPreference('activeClusterId')
  const cluster = useMemo(() => clusterLive.find((item) => item.id === activeId), [activeId, clusterLive])

  return cluster ? render({ cluster }) : fallback
}

export function PortfolioUiClusterWalletGuard({
  render,
}: {
  render: (props: { cluster: Cluster; wallet: Wallet }) => React.ReactNode
}) {
  return (
    <PortfolioUiClusterGuard
      render={({ cluster }) => <PortfolioUiWalletGuard render={({ wallet }) => render({ cluster, wallet })} />}
    />
  )
}
