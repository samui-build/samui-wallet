import type { Cluster } from '@workspace/db/entity/cluster'

import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import React, { useMemo } from 'react'

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
