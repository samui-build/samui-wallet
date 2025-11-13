import { useMemo } from 'react'
import { useDbAccountLive } from './use-db-account-live.tsx'
import { useDbSetting } from './use-db-setting.tsx'

export function useDbAccountActive() {
  const [accountId] = useDbSetting('activeAccountId')
  const [walletId] = useDbSetting('activeWalletId')
  if (!walletId) {
    throw new Error('No active wallet set.')
  }
  const accountLive = useDbAccountLive({ walletId })
  const account = useMemo(() => accountLive.find((item) => item.id === accountId), [accountId, accountLive])
  if (!account) {
    throw new Error('No active account set.')
  }

  return account
}
