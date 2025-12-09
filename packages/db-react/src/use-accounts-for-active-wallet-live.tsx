import { useAccountsForWalletLive } from './use-accounts-for-wallet-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountsForActiveWalletLive() {
  const [activeWalletId] = useSetting('activeWalletId')
  if (!activeWalletId) {
    throw new Error('No active wallet set.')
  }

  return useAccountsForWalletLive({ walletId: activeWalletId })
}
