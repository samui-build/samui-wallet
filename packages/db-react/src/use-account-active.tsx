import { useMemo } from 'react'
import { useAccountLive } from './use-account-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountActive() {
  const [accountId] = useSetting('activeAccountId')
  const [walletId] = useSetting('activeWalletId')
  if (!walletId) {
    throw new Error('No active wallet set.')
  }
  const accountLive = useAccountLive({ walletId })
  const account = useMemo(() => accountLive.find((item) => item.id === accountId), [accountId, accountLive])
  if (!account) {
    throw new Error('No active account set.')
  }

  return account
}
