import { useMemo } from 'react'
import { useAccountsForActiveWalletLive } from './use-accounts-for-active-wallet-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountActive() {
  const accounts = useAccountsForActiveWalletLive()
  const [activeAccountId] = useSetting('activeAccountId')
  const accountActive = useMemo(() => accounts.find((item) => item.id === activeAccountId), [activeAccountId, accounts])
  if (!accountActive) {
    throw new Error('No active account set.')
  }

  return accountActive
}
