import { useMemo } from 'react'
import { useDbSetting } from './use-db-setting.tsx'
import { useDbWalletLive } from './use-db-wallet-live.tsx'

export function useDbWalletActive() {
  const [walletId] = useDbSetting('activeWalletId')
  if (!walletId) {
    throw new Error('No active wallet id set.')
  }
  const walletLive = useDbWalletLive()
  const wallet = useMemo(() => walletLive.find((item) => item.id === walletId), [walletId, walletLive])
  if (!wallet) {
    throw new Error('No active wallet set.')
  }

  return wallet
}
