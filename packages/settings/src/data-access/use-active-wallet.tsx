import { useSetting } from '@workspace/db-react/use-setting'
import { useWalletLive } from '@workspace/db-react/use-wallet-live'
import { useWalletSetActive } from '@workspace/db-react/use-wallet-set-active'
import { useMemo } from 'react'

export function useActiveWallet() {
  const wallets = useWalletLive()
  const [activeId] = useSetting('activeWalletId')
  const { mutateAsync } = useWalletSetActive()
  const active = useMemo(() => wallets.find((c) => c.id === activeId) ?? null, [wallets, activeId])

  return {
    active,
    setActive: (id: string) => mutateAsync({ id }),
    wallets,
  }
}
