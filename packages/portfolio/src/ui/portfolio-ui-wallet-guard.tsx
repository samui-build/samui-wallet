import type { Wallet } from '@workspace/db/entity/wallet'

import { useDbPreferenceFindUniqueByKeyLive } from '@workspace/db-react/use-db-preference-find-unique-by-key-live'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import React, { useMemo } from 'react'

export interface PortfolioUiWalletGuardProps {
  fallback?: React.ReactNode
  render: (props: { wallet: Wallet }) => React.ReactNode
}

export function PortfolioUiWalletGuard({
  fallback = <div>Wallet not selected</div>,
  render,
}: PortfolioUiWalletGuardProps) {
  const walletLive = useDbWalletLive()
  const activeWalletId = useDbPreferenceFindUniqueByKeyLive({ key: 'activeWalletId' })

  const wallet = useMemo(
    () => walletLive.find((item) => item.id === activeWalletId?.value),
    [activeWalletId, walletLive],
  )

  return wallet ? render({ wallet }) : fallback
}
