import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'

import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { type ReactNode, useMemo } from 'react'

import { PortfolioUiAccountGuard } from './portfolio-ui-account-guard.tsx'

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

export function PortfolioUiNetworkAccountGuard({
  render,
}: {
  render: (props: { account: Account; network: Network }) => ReactNode
}) {
  return (
    <PortfolioUiNetworkGuard
      render={({ network }) => <PortfolioUiAccountGuard render={({ account }) => render({ account, network })} />}
    />
  )
}
