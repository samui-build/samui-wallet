import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useDbWalletSetActive } from '@workspace/db-react/use-db-wallet-set-active'
import { useMemo } from 'react'

export function useActiveWallet() {
  const wallets = useDbWalletLive()
  const [activeId] = useDbPreference('activeWalletId')
  const { mutateAsync } = useDbWalletSetActive()
  const active = useMemo(() => wallets.find((c) => c.id === activeId) ?? null, [wallets, activeId])

  return {
    active,
    setActive: (id: string) => mutateAsync({ id }),
    wallets,
  }
}
