import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { type ReactNode, useMemo } from 'react'

export interface PortfolioUiWalletGuardProps {
  fallback?: ReactNode
  render: (props: { wallet: Wallet }) => ReactNode
}

export function PortfolioUiWalletGuard({
  fallback = <div>Wallet not selected</div>,
  render,
}: PortfolioUiWalletGuardProps) {
  const [walletId] = useDbSetting('activeWalletId')
  const [accountId] = useDbSetting('activeAccountId')
  const walletLive = useDbWalletLive({ accountId: accountId })

  const wallet = useMemo(() => walletLive.find((item) => item.id === walletId), [walletId, walletLive])

  return wallet ? render({ wallet }) : fallback
}
