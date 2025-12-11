import { useMemo } from 'react'
import { useSetting } from './use-setting.tsx'
import { useWalletLive } from './use-wallet-live.tsx'

export function useWalletActive() {
  const wallets = useWalletLive()
  const [activeWalletId] = useSetting('activeWalletId')
  const activeWallet = useMemo(() => wallets.find((item) => item.id === activeWalletId), [activeWalletId, wallets])
  if (!activeWallet) {
    throw new Error('No active wallet set.')
  }

  return activeWallet
}
