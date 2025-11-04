import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useDbWalletSetActive } from '@workspace/db-react/use-db-wallet-set-active'
import { useMemo } from 'react'

import { useSortWallets } from './use-sort-wallets.tsx'

export function useActiveWallet() {
  const [walletId] = useDbPreference('activeWalletId')
  const [accountId] = useDbPreference('activeAccountId')
  const { mutateAsync } = useDbWalletSetActive()
  const wallets = useDbWalletLive({ accountId: accountId })
  const sorted = useSortWallets(wallets)
  const active = useMemo(() => wallets.find((c) => c.id === walletId) ?? null, [wallets, walletId])

  return {
    active,
    setActive: (id: string) => mutateAsync({ id }),
    wallets: sorted,
  }
}
