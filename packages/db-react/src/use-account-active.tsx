import { useMemo } from 'react'
import { useAccountsForActiveWalletLive } from './use-accounts-for-active-wallet-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountActive() {
  const [accountId] = useSetting('activeAccountId')
  const accounts = useAccountsForActiveWalletLive()
  const account = useMemo(() => accounts.find((item) => item.id === accountId), [accountId, accounts])
  if (!account) {
    throw new Error('No active account set.')
  }

  return account
}
